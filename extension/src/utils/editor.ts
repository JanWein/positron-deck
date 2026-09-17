import * as vscode from 'vscode';
import { Cancelled, UserError } from './errors';
export function activeEditor(): vscode.TextEditor {
  const editor = vscode.window.activeTextEditor;
  if (!editor) throw new UserError('Open a source file first.');
  return editor;
}
export async function savedDocument(): Promise<vscode.TextDocument> {
  const document = activeEditor().document;
  if (document.isUntitled || document.isDirty) if (!await document.save()) throw new Cancelled();
  return document;
}
