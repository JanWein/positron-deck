import * as vscode from 'vscode';
import { loadPositron, PositronApi } from './positron';
import { CommandBridge } from '../utils/commands';
import { Cancelled, UserError } from '../utils/errors';
export class RuntimeAdapter {
  constructor(readonly bridge: CommandBridge, readonly positron: PositronApi | undefined = loadPositron()) {}
  async execute(language: string, code: string, uri?: vscode.Uri): Promise<void> {
    if (!this.positron) throw new UserError('This action needs a Positron runtime. Use Positron or the documented VS Code provider fallback.');
    const session = await this.positron.runtime.getForegroundSession();
    if (session && session.runtimeMetadata.languageId !== language) throw new UserError(`The active runtime is ${session.runtimeMetadata.languageId}. Select a ${language} runtime and retry.`);
    const state = session?.getRuntimeState?.();
    if (state && state !== 'idle' && state !== 'ready') throw new UserError('The active runtime is busy or unavailable. Wait, or use Stop Execution.');
    const result = await this.positron.runtime.executeCode(language, code, true, false, undefined, undefined, undefined, session?.metadata.sessionId, uri);
    // Older Positron releases return boolean acceptance rather than an execution result.
    if (result === false) throw new UserError('The runtime did not accept the code. Check the Positron Console.');
  }
  async restart(): Promise<void> {
    if (await vscode.window.showWarningMessage('Restart the active runtime? In-memory objects will be lost.', {modal:true}, 'Restart') !== 'Restart') throw new Cancelled();
    const session = await this.positron?.runtime.getForegroundSession();
    if (this.positron?.runtime.restartSession && session) {
      if (!await this.positron.runtime.restartSession(session.metadata.sessionId)) throw new Cancelled();
    } else await this.bridge.run('workbench.action.language.runtime.restartActiveSession');
  }
  async stop(): Promise<void> {
    const session = await this.positron?.runtime.getForegroundSession();
    if (this.positron?.runtime.interruptSession && session) await this.positron.runtime.interruptSession(session.metadata.sessionId);
    else await this.bridge.run('workbench.action.languageRuntime.interrupt');
  }
  async executable(language: 'r' | 'python', uri: vscode.Uri): Promise<string> {
    const config = vscode.workspace.getConfiguration('positronDeck', uri);
    const configured = config.get<string>(language === 'r' ? 'r.executable' : 'python.executable', '');
    if (configured) return configured;
    const session = await this.positron?.runtime.getForegroundSession();
    if (session?.runtimeMetadata.languageId === language) return session.runtimeMetadata.runtimePath;
    const preferred = await this.positron?.runtime.getPreferredRuntime?.(language);
    if (preferred) return preferred.runtimePath;
    return language === 'r' ? 'R' : 'python';
  }
}
