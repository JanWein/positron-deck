import * as vscode from 'vscode';
import { UserError } from './errors';
export class CommandBridge {
  async available(id: string, extension?: string): Promise<boolean> {
    if (extension) {
      const installed = vscode.extensions.getExtension(extension);
      if (installed && !installed.isActive) await installed.activate();
    }
    return (await vscode.commands.getCommands(true)).includes(id);
  }
  async run(id: string, args: unknown[] = [], extension?: string): Promise<unknown> {
    if (!await this.available(id, extension)) throw new UserError(`Command ${id} is unavailable. Enable the corresponding extension or use a supported host.`);
    return vscode.commands.executeCommand(id, ...args);
  }
}
