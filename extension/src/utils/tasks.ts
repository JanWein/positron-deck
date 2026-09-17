import * as vscode from 'vscode';
import { Logger } from './logger';
import { UserError } from './errors';
export class TaskRunner implements vscode.Disposable {
  private readonly owned = new Map<string, vscode.TaskExecution>();
  private readonly starting = new Set<string>();
  private readonly listeners: vscode.Disposable[];
  constructor(private logger: Logger) {
    this.listeners = [vscode.tasks.onDidEndTask(e => {
      for (const [key, value] of this.owned) if (value === e.execution) this.owned.delete(key);
    }), vscode.tasks.onDidEndTaskProcess(e => {
      if (![...this.owned.values()].includes(e.execution)) return;
      const key = [...this.owned].find(([, execution]) => execution === e.execution)?.[0];
      const kind = key?.slice(key.lastIndexOf(':') + 1) ?? 'task';
      this.logger.log(e.exitCode === 0 ? 'info' : 'error', e.exitCode === 0 ? 'task.succeeded' : 'task.stopped-or-failed', {kind,exitCode:e.exitCode ?? -1});
      if (e.exitCode !== undefined && e.exitCode !== 0) {
        void vscode.window.showWarningMessage(`Positron Deck: ${kind} exited with code ${e.exitCode}. Check its task terminal for details; it may have been stopped manually.`);
      } else if (e.exitCode === 0 && vscode.workspace.getConfiguration('positronDeck').get('showNotifications',true)) {
        vscode.window.setStatusBarMessage(`Positron Deck: ${kind} completed successfully`,4000);
      }
    })];
  }
  key(folder: vscode.WorkspaceFolder, kind: string): string { return `${folder.uri.toString()}:${kind}`; }
  async execute(folder: vscode.WorkspaceFolder, kind: string, task: vscode.Task): Promise<void> {
    const key = this.key(folder,kind);
    if (this.owned.has(key) || this.starting.has(key)) throw new UserError(`A ${kind} task is already running for this project. Stop it in Tasks or use Stop App.`);
    this.starting.add(key);
    try { this.owned.set(key,await vscode.tasks.executeTask(task)); }
    finally { this.starting.delete(key); }
    this.logger.log('info','task.started',{kind});
  }
  async start(folder: vscode.WorkspaceFolder, kind: string, executable: string, args: string[]): Promise<void> {
    const task = new vscode.Task({type:'positronDeck',kind},folder,`Positron Deck: ${kind}`,'Positron Deck',new vscode.ProcessExecution(executable,args,{cwd:folder.uri.fsPath}));
    task.presentationOptions = {reveal:vscode.TaskRevealKind.Always,panel:vscode.TaskPanelKind.Dedicated,clear:true};
    await this.execute(folder,kind,task);
  }
  async stopApp(folder: vscode.WorkspaceFolder): Promise<void> {
    const execution = this.owned.get(this.key(folder,'app'));
    if (!execution) throw new UserError('No app started by Positron Deck is running for this project. Use its owning terminal or task to stop other apps.');
    execution.terminate();
  }
  dispose(): void { this.listeners.forEach(l => l.dispose()); }
}
