import * as vscode from 'vscode';
export class Logger implements vscode.Disposable {
  private readonly output = vscode.window.createOutputChannel('Positron Deck');
  log(level: 'error' | 'info' | 'debug', event: string, fields: Record<string, string | number | boolean> = {}): void {
    const setting = vscode.workspace.getConfiguration('positronDeck').get<string>('logging.level', 'info');
    const levels = ['off', 'error', 'info', 'debug'];
    if (levels.indexOf(level) > levels.indexOf(setting)) return;
    // Callers supply only fixed event names, command IDs and booleans. Never user code,
    // paths, custom commands, environment variables or raw third-party errors.
    this.output.appendLine(`${new Date().toISOString()} [${level}] ${event} ${JSON.stringify(fields)}`);
  }
  show(): void { this.output.show(true); }
  dispose(): void { this.output.dispose(); }
}
