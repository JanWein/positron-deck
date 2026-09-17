import * as vscode from 'vscode';
import { Services } from '../../services';
import { DeploymentProvider } from './types';
import { Cancelled, UserError } from '../../utils/errors';
export function deploymentProviders(s: Services): DeploymentProvider[] {
  return [
    {id:'positPublisher',prepare:async p => {
      if (!await s.bridge.available('posit.publisher.deployWithEntrypoint','posit.publisher')) throw new UserError('Install and enable Posit Publisher first.');
      const editor = vscode.window.activeTextEditor;
      const entrypoint = editor && vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri.toString() === p.root.toString() ? editor.document.uri : undefined;
      if (!entrypoint) throw new UserError('Open the deployment entrypoint file in the selected project first.');
      if (!await editor!.document.save()) throw new Cancelled();
      return {description:'Open the Posit Publisher deployment workflow for the active file. Publisher manages targets and credentials.',execute:async () => { await s.bridge.run('posit.publisher.deployWithEntrypoint',[entrypoint]); }};
    }},
    {id:'git',prepare:async p => {
      if (!p.isGitRepository) throw new UserError('The selected project is not a Git repository.');
      return {description:'Push the selected repository using its configured remote and branch. Any deployment is handled by your existing Git automation.',execute:async () => { await s.bridge.run('git.push',[p.root],'vscode.git'); }};
    }},
    {id:'task',prepare:async p => {
      const name = vscode.workspace.getConfiguration('positronDeck',p.root).get<string>('deploy.task','Deploy');
      const matches = (await vscode.tasks.fetchTasks()).filter(t => t.name === name && ((typeof t.scope === 'object' && t.scope.uri.toString() === p.root.toString()) || t.scope === vscode.TaskScope.Workspace));
      if (!matches.length) throw new UserError('The configured deployment task was not found in the selected project. Configure positronDeck.deploy.task.');
      const chosen = matches.length === 1 ? matches[0] : (await vscode.window.showQuickPick(matches.map((task,i) => ({label:task.name,description:`${task.source} (${i+1})`,task})),{placeHolder:'Choose the deployment task'}))?.task;
      if (!chosen) throw new Cancelled();
      return {description:'Run the configured VS Code deployment task. Review its definition in Tasks first.',execute:async () => { await s.tasks.execute(p.folder,'deploy',chosen); }};
    }},
    {id:'custom',prepare:async p => {
      const command = vscode.workspace.getConfiguration('positronDeck',p.root).get<string>('deploy.command','').trim();
      if (!command) throw new UserError('Set positronDeck.deploy.command to a deployment script, or choose another provider.');
      return {description:'Execute the custom deployment command configured for this workspace. Review positronDeck.deploy.command first.',execute:async () => {
        const task = new vscode.Task({type:'positronDeck',kind:'deploy'},p.folder,'Positron Deck: deploy','Positron Deck',new vscode.ShellExecution(command,{cwd:p.root.fsPath}));
        task.presentationOptions = {reveal:vscode.TaskRevealKind.Always};
        await s.tasks.execute(p.folder,'deploy',task);
      }};
    }},
  ];
}
