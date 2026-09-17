import type * as vscode from 'vscode';
/** Minimal structural facade, sourced from Positron's official positron.d.ts.
 * Optional newer members are capability checked, never assumed present. */
export interface RuntimeSession {
  metadata: {sessionId: string};
  runtimeMetadata: {languageId: string; runtimePath: string};
  getRuntimeState?(): string;
}
export interface PositronApi {
  runtime: {
    executeCode(language: string, code: string, focus: boolean, allowIncomplete?: boolean,
      mode?: undefined, errorBehavior?: undefined, observer?: undefined, sessionId?: string, documentUri?: vscode.Uri): Thenable<unknown>;
    getForegroundSession(): Thenable<RuntimeSession | undefined>;
    getPreferredRuntime?(language: string): Thenable<{runtimePath: string} | undefined>;
    restartSession?(id: string): Thenable<boolean>;
    interruptSession?(id: string): Thenable<void>;
  };
}
export function loadPositron(): PositronApi | undefined {
  try {
    const api = require('positron') as PositronApi;
    return typeof api?.runtime?.executeCode === 'function' ? api : undefined;
  } catch { return undefined; }
}
