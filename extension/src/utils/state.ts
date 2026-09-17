import * as vscode from 'vscode';
export type ActionPhase = 'running' | 'dispatched' | 'succeeded' | 'failed' | 'cancelled';
export interface ActionEvent { command: string; phase: ActionPhase; time: number }
/** In-process events only. A future transport can consume these without changing commands. */
export class DeckState implements vscode.Disposable {
  private readonly emitter = new vscode.EventEmitter<ActionEvent>();
  readonly onDidChange = this.emitter.event;
  private readonly values = new Map<string, ActionEvent>();
  set(command: string, phase: ActionPhase): void {
    const event = { command, phase, time: Date.now() };
    this.values.set(command, event); this.emitter.fire(event);
  }
  snapshot(): ActionEvent[] { return [...this.values.values()]; }
  dispose(): void { this.emitter.dispose(); }
}
