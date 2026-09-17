import * as vscode from 'vscode';
import { Logger } from './logger';
import { DeckState } from './state';
import { Cancelled, UserError } from './errors';
export type Handler = () => Promise<unknown>;
export class Registry {
  private readonly running = new Set<string>();
  private readonly handlers = new Map<string, {handler: Handler; trusted: boolean}>();
  async invoke(name: string): Promise<unknown> {
    const entry=this.handlers.get(name);
    if(!entry) throw new UserError(`Unknown Deck command: ${name}`);
    if(entry.trusted && !vscode.workspace.isTrusted) throw new UserError("Trust this workspace before running a workflow.");
    const id=`positronDeck.${name}`;
    if(this.running.has(id)) throw new UserError(`Action ${name} is already running.`);
    this.running.add(id);
    try { return await entry.handler(); } finally { this.running.delete(id); }
  }
  constructor(private context: vscode.ExtensionContext, private logger: Logger, private state: DeckState) {}
  add(name: string, handler: Handler, trusted = true): void {
    this.handlers.set(name,{handler,trusted});
    const id = `positronDeck.${name}`;
    this.context.subscriptions.push(vscode.commands.registerCommand(id, async () => {
      if (this.running.has(id)) { vscode.window.setStatusBarMessage('Positron Deck: action already running', 2500); return; }
      this.running.add(id);
      let busy: vscode.Disposable | undefined;
      try {
        if (trusted && !vscode.workspace.isTrusted) throw new UserError('Trust this workspace before running project code or Git actions.');
        busy = vscode.window.setStatusBarMessage(`$(sync~spin) Positron Deck: ${name}`);
        this.logger.log('info', 'command.started', { command: id }); this.state.set(id, 'running');
        await handler();
        // Delegated UI/terminal actions may continue asynchronously; never label them passed.
        this.state.set(id, 'dispatched'); this.logger.log('info', 'command.dispatched', { command: id });
        if (vscode.workspace.getConfiguration('positronDeck').get('showNotifications', true)) {
          vscode.window.setStatusBarMessage(`Positron Deck: ${name} handled; see the target view for results`, 3500);
        }
      } catch (error) {
        if (error instanceof Cancelled) { this.state.set(id, 'cancelled'); this.logger.log('info', 'command.cancelled', { command: id }); return; }
        this.state.set(id, 'failed'); this.logger.log('error', 'command.failed', { command: id, expected: error instanceof UserError });
        const message = error instanceof UserError ? error.message : `Could not complete ${name}. Check the relevant Console, Git, Testing or Task output.`;
        const choice = await vscode.window.showErrorMessage(`Positron Deck: ${message}`, 'Show Log');
        if (choice === 'Show Log') this.logger.show();
      } finally { busy?.dispose(); this.running.delete(id); }
    }));
  }
}
