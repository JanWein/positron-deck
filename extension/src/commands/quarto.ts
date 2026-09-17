import * as vscode from 'vscode';
import { Registry } from '../utils/register';
import { Services } from '../services';
import { savedDocument } from '../utils/editor';
import { Cancelled, UserError } from '../utils/errors';
export function registerQuarto(registry: Registry,s: Services): void {
  for (const action of ['render','preview'] as const) registry.add(action,async () => {
    const editor = vscode.window.activeTextEditor;
    const isQmd = editor && /\.qmd$/i.test(editor.document.uri.path);
    const project = await s.project();
    if (!isQmd && !project.isQuartoProject) throw new UserError('Open a .qmd file or a folder containing _quarto.yml.');
    const target = isQmd ? (await savedDocument()).uri.fsPath : project.root.fsPath;
    if (!await vscode.workspace.saveAll(false)) throw new Cancelled();
    // Quarto render commands use the editor and may start a live preview themselves.
    // Its project command has no target argument and picks the first workspace;
    // in multi-root workspaces use the CLI to preserve the selected project.
    const id = isQmd ? 'quarto.render' : 'quarto.renderProject';
    const nativeSafe = isQmd || vscode.workspace.workspaceFolders?.length === 1;
    if (nativeSafe && await s.bridge.available(id,'quarto.quarto')) {
      await s.bridge.run(id); return;
    }
    const executable = vscode.workspace.getConfiguration('positronDeck',project.root).get<string>('quarto.executable','quarto');
    await s.tasks.start(project.folder,`quarto-${action}`,executable,[action,target]);
  });
}
