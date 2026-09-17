import * as vscode from 'vscode';
import { Registry } from '../utils/register';
import { Services } from '../services';
import { activeEditor, savedDocument } from '../utils/editor';
import { UserError } from '../utils/errors';
export function registerCode(registry: Registry, s: Services): void {
  registry.add('runSelection', async () => {
    const editor = activeEditor();
    const language = editor.document.languageId;
    if (language === 'quarto') { await s.bridge.run('quarto.runSelection', [], 'quarto.quarto'); return; }
    if (!['r','python'].includes(language)) throw new UserError('Run Selection supports R, Python and Quarto source files.');
    if (s.runtime.positron) {
      // Use Positron's parser-aware Ctrl+Enter behavior for complete statements.
      if (await s.bridge.available('workbench.action.positronConsole.executeCode')) {
        await s.bridge.run('workbench.action.positronConsole.executeCode'); return;
      }
      const text = editor.selection.isEmpty ? editor.document.lineAt(editor.selection.active.line).text : editor.document.getText(editor.selection);
      if (!text.trim()) return;
      await s.runtime.execute(language,text,editor.document.uri);
    } else await s.bridge.run(language === 'r' ? 'r.runSelection' : 'python.execSelectionInTerminal', [], language === 'r' ? 'REditorSupport.r' : 'ms-python.python');
  });
  registry.add('runFile', async () => {
    const doc = await savedDocument();
    const language = doc.languageId;
    if (language === 'quarto' || /\.qmd$/i.test(doc.uri.path)) { await vscode.commands.executeCommand('positronDeck.render'); return; }
    if (!['r','python'].includes(language)) throw new UserError('Run File supports R, Python and Quarto files.');
    if (s.runtime.positron) {
      const path = JSON.stringify(doc.uri.fsPath);
      // source preserves R file semantics, including source references. Python runpy
      // sets __file__ and __name__ while retaining results in the console globals.
      const code = language === 'r' ? `base::source(${path}, local=.GlobalEnv)` : `globals().update(__import__("runpy").run_path(${path}, run_name="__main__"))`;
      await s.runtime.execute(language,code,doc.uri);
    } else await s.bridge.run(language === 'r' ? 'r.runSource' : 'python.execInTerminal', [], language === 'r' ? 'REditorSupport.r' : 'ms-python.python');
  });
  registry.add('restartRuntime', () => s.runtime.restart());
  registry.add('stopExecution', () => s.runtime.stop());
  registry.add('format', async () => { activeEditor(); await s.bridge.run('editor.action.formatDocument'); });
}
