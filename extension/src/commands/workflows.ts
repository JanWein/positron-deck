import * as vscode from 'vscode';
import catalog from '../catalog.json';
import { Registry } from '../utils/register';
import { Services } from '../services';
import { Cancelled, UserError } from '../utils/errors';
export type Step = { command: string; args?: unknown[] } | { task: string } | { save: 'all' | 'active' };
export interface Workflow { name: string; steps: Step[] }
const builtins: Record<string,Workflow> = {
  saveAndRun:{name:'Save and Run',steps:[{save:'active'},{command:'positronDeck.runFile'}]},
  formatAndSave:{name:'Format and Save',steps:[{command:'positronDeck.format'},{save:'active'}]},
  saveAndTest:{name:'Save and Test',steps:[{save:'all'},{command:'positronDeck.test'}]},
  reviewWorkspace:{name:'Review Workspace',steps:[{save:'all'},{command:'positronDeck.openSourceControl'},{command:'positronDeck.openProblems'}]},
  analysisWorkspace:{name:'Analysis Workspace',steps:[{command:'positronDeck.layoutStacked'},{command:'positronDeck.openVariables'},{command:'positronDeck.focusEditor'}]},
  quartoWorkspace:{name:'Quarto Workspace',steps:[{save:'active'},{command:'positronDeck.layoutStacked'},{command:'positronDeck.preview'}]}
};
export function validateWorkflow(value: unknown): asserts value is Workflow {
  if (!value || typeof value !== 'object') throw new UserError('A workflow must be an object.');
  const w=value as Workflow;
  if (typeof w.name !== 'string' || !w.name.trim() || !Array.isArray(w.steps) || w.steps.length<1 || w.steps.length>32) throw new UserError('A workflow needs a name and 1–32 steps.');
  for (const step of w.steps) {
    if (!step || typeof step !== 'object' || ['command','task','save'].filter(k=>k in step).length!==1) throw new UserError('Each workflow step needs exactly one of command, task or save.');
    if ('command' in step) {
      if (typeof step.command!=='string' || !step.command.trim() || ('args' in step && !Array.isArray(step.args))) throw new UserError('Workflow commands need an ID and an optional args array.');
      if (/^positronDeck\.(runWorkflow|workflowSlot\d+)$/.test(step.command) || Object.keys(builtins).some(k=>step.command===`positronDeck.${k}`)) throw new UserError('Nested workflows are not supported. List their steps directly.');
    } else if ('task' in step) { if (typeof step.task!=='string' || !step.task.trim()) throw new UserError('A task step needs its exact task label.'); }
    else if (!['all','active'].includes(step.save)) throw new UserError('Save must be active or all.');
  }
}
/** Subscribe before dispatch so a short-lived process cannot outrun the listener. */
export async function runTaskAndWait(task: vscode.Task): Promise<void> {
  let execution: vscode.TaskExecution | undefined;
  const early: Array<{process:vscode.TaskProcessEndEvent}|{end:vscode.TaskEndEvent}>=[];
  let resolve!: () => void; let reject!: (error: Error) => void;
  const done=new Promise<void>((yes,no)=>{resolve=yes;reject=no;});
  const processEnd=(e:vscode.TaskProcessEndEvent) => {
    if (!execution) {early.push({process:e});return;}
    if (e.execution!==execution) return;
    if (e.exitCode===0) resolve(); else reject(new UserError(`Task ${task.name} stopped or failed (exit ${e.exitCode ?? 'unknown'}). Remaining workflow steps were skipped.`));
  };
  const taskEnd=(e:vscode.TaskEndEvent)=>{
    if(!execution){early.push({end:e});return;}
    if (execution===e.execution) reject(new UserError(`Task ${task.name} ended without a successful process exit. Remaining steps were skipped.`));
  };
  const listeners=[vscode.tasks.onDidEndTaskProcess(processEnd),vscode.tasks.onDidEndTask(taskEnd)];
  try {execution=await vscode.tasks.executeTask(task);early.forEach(e=>'process' in e?processEnd(e.process):taskEnd(e.end));await done;}
  finally {listeners.forEach(l=>l.dispose());}
}
export async function runWorkflow(w: Workflow, registry: Registry, s: Services): Promise<void> {
  validateWorkflow(w);
  // Preflight the whole chain before changing files or launching work.
  const tasks=await vscode.tasks.fetchTasks();
  const resolvedTasks=new Map<string,vscode.Task>();
  const folder=vscode.window.activeTextEditor ? vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri) : vscode.workspace.workspaceFolders?.length===1?vscode.workspace.workspaceFolders[0]:undefined;
  for (const step of w.steps) {
    if ('command' in step && !await s.bridge.available(step.command)) throw new UserError(`Workflow command ${step.command} is unavailable.`);
    if ('task' in step) {
      let matches=tasks.filter(t=>t.name===step.task);
      if (folder) { const scoped=matches.filter(t=>typeof t.scope==='object' && t.scope.uri.toString()===folder.uri.toString()); if(scoped.length) matches=scoped; }
      if(matches.length!==1) throw new UserError(`Task ${step.task} must identify exactly one task in this workspace.`);
      if(matches[0].isBackground) throw new UserError('Workflow task gates must be finite tasks, not background servers.');
      resolvedTasks.set(step.task,matches[0]);
    }
  }
  for (const step of w.steps) {
    if ('save' in step) {
      const ok=step.save==='all' ? await vscode.workspace.saveAll(false) : await vscode.window.activeTextEditor?.document.save();
      if (!ok) throw new Cancelled();
    } else if ('task' in step) await runTaskAndWait(resolvedTasks.get(step.task)!);
    else if (step.command.startsWith('positronDeck.')) await registry.invoke(step.command.slice('positronDeck.'.length));
    else await s.bridge.run(step.command,step.args ?? []);
  }
}
export function registerWorkflows(registry: Registry,s: Services): void {
  for (const [id,w] of Object.entries(builtins)) registry.add(id,()=>runWorkflow(w,registry,s));
  const custom=async (w:Workflow) => {
    validateWorkflow(w);
    const steps=w.steps.map(step=>'command' in step?step.command:'task' in step?`Task: ${step.task}`:`Save ${step.save}`).join('\n');
    if(await vscode.window.showWarningMessage(`Run workflow “${w.name}”?\n${steps}`,{modal:true},'Run')!=='Run')throw new Cancelled();
    await runWorkflow(w,registry,s);
  };
  registry.add('runWorkflow',async()=>{
    const configured=vscode.workspace.getConfiguration('positronDeck').get<Workflow[]>('workflows',[]);
    if(!Array.isArray(configured))throw new UserError('positronDeck.workflows must be an array.');
    configured.forEach(validateWorkflow);
    const items=[...Object.values(builtins).map(w=>({label:w.name,w,custom:false})),...configured.map(w=>({label:w.name,w,custom:true}))];
    const pick=await vscode.window.showQuickPick(items,{placeHolder:'Choose an IDE-side workflow'});
    if(!pick)throw new Cancelled();
    if(pick.custom)await custom(pick.w);else await runWorkflow(pick.w,registry,s);
  });
  for(let i=1;i<=8;i++)registry.add(`workflowSlot${i}`,async()=>{
    const cfg=vscode.workspace.getConfiguration('positronDeck');
    const name=cfg.get<string[]>('workflowSlots',[])[i-1];
    const configured=cfg.get<Workflow[]>('workflows',[]);if(!Array.isArray(configured))throw new UserError('positronDeck.workflows must be an array.');configured.forEach(validateWorkflow);
    const matches=configured.filter(w=>w.name===name);
    if(!name || matches.length!==1)throw new UserError(`Assign a unique workflow name to workflowSlots position ${i} and define it in positronDeck.workflows.`);
    await custom(matches[0]);
  });
  registry.add('diagnostics',async()=>{
    const commands=new Set(await vscode.commands.getCommands(true));
    const lines=catalog.filter(a=>a.kind==='delegate').map(a=>`${a.targets.some(t=>commands.has(t))?'AVAILABLE':'MISSING'} | ${a.name} | ${a.targets.join(', ')}`);
    const doc=await vscode.workspace.openTextDocument({language:'plaintext',content:'Positron Deck: native action availability\n\nLazy extensions and optional views may register commands only after activation.\n\n'+lines.join('\n')});
    await vscode.window.showTextDocument(doc);
  },false);
  registry.add('configureTerminal',async()=>{
    if(await vscode.window.showWarningMessage('Allow all Positron Deck hotkeys to bypass the terminal shell? This updates your user setting.',{modal:true},'Enable')!=='Enable')throw new Cancelled();
    const cfg=vscode.workspace.getConfiguration('terminal.integrated');
    const ids=catalog.map(a=>a.command);const existing=cfg.get<string[]>('commandsToSkipShell',[]).filter(id=>!ids.some(x=>id===`-${x}`));
    await cfg.update('commandsToSkipShell',[...new Set([...existing,...ids])],vscode.ConfigurationTarget.Global);
  });
}
