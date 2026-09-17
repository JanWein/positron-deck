import * as vscode from 'vscode';
import { classifyProject } from './classify';
import { Project } from './types';
import { Cancelled, UserError } from '../utils/errors';
import { Logger } from '../utils/logger';
export async function workspaceFolder(): Promise<vscode.WorkspaceFolder> {
  const folders = vscode.workspace.workspaceFolders ?? [];
  const editor = vscode.window.activeTextEditor;
  const active = editor && vscode.workspace.getWorkspaceFolder(editor.document.uri);
  if (active) return active;
  if (!folders.length) throw new UserError('Open a project folder first.');
  if (folders.length === 1) return folders[0];
  const pick = await vscode.window.showWorkspaceFolderPick({placeHolder:'Select the project for this action'});
  if (!pick) throw new Cancelled();
  return pick;
}
export async function detectProject(logger: Logger): Promise<Project> {
  const folder = await workspaceFolder();
  const entries = await vscode.workspace.fs.readDirectory(folder.uri);
  const names = entries.map(([name]) => name);
  const contents: Record<string, string> = {};
  await Promise.all(['DESCRIPTION','pyproject.toml','requirements.txt','app.py','main.py','streamlit_app.py'].filter(n => names.includes(n)).map(async name => {
    const uri = vscode.Uri.joinPath(folder.uri, name);
    const stat = await vscode.workspace.fs.stat(uri);
    if (stat.size <= 512 * 1024) contents[name] = new TextDecoder().decode(await vscode.workspace.fs.readFile(uri));
  }));
  const facts = classifyProject({names,contents});
  // Git worktrees and nested workspace folders may have .git outside the root.
  const git = vscode.extensions.getExtension<{getAPI(version: number): {repositories: {rootUri: vscode.Uri}[]}}>('vscode.git');
  if (git) {
    try {
      const api = (git.isActive ? git.exports : await git.activate()).getAPI(1);
      facts.isGitRepository ||= api.repositories.some(r => folder.uri.toString() === r.rootUri.toString() || folder.uri.toString().startsWith(r.rootUri.toString() + '/'));
    } catch { /* Git disabled; filesystem facts remain valid. */ }
  }
  logger.log('info','project.detected',{...facts});
  return {folder,root:folder.uri,...facts};
}
