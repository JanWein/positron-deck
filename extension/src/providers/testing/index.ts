import * as vscode from 'vscode';
import * as path from 'node:path';
import { Services } from '../../services';
import { TestingProvider } from './types';
import { Cancelled, UserError } from '../../utils/errors';
import { savedDocument } from '../../utils/editor';
import { executeRPackage } from '../../commands/rPackage';
import { rString } from '../../utils/rCode';
export function testingProviders(s: Services): TestingProvider[] {
  return [
    {id:'native', supports: async () => {
      // This capability-checked command is from VS Code source, not a public API.
      // getCommands('testing.runAll') alone says nothing about installed providers.
      if (!await s.bridge.available('testing.getSelectedProfiles')) return false;
      try {
        const profiles = await vscode.commands.executeCommand<unknown>('testing.getSelectedProfiles');
        return Array.isArray(profiles) && profiles.some(p => p && p.kind === vscode.TestRunProfileKind.Run);
      } catch { return false; }
    }, run: async (_p, file) => { await s.bridge.run(file ? 'testing.runCurrentFile' : 'testing.runAll'); }},
    {id:'r', supports: async p => p.isRPackage, run: async (p, file) => {
      let expression = `devtools::test(pkg=${rString(p.root.fsPath)})`;
      if (file) {
        const document = await savedDocument();
        const relative = path.relative(p.root.fsPath,document.uri.fsPath).replaceAll('\\','/');
        if (!/^tests\/testthat\/test-[^/]+\.[rR]$/.test(relative)) throw new UserError('Open a tests/testthat/test-*.R file for current-file testing.');
        const stem = path.basename(relative).replace(/^test-/,'').replace(/\.[rR]$/,'');
        const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        expression = `devtools::test(pkg=${rString(p.root.fsPath)}, filter=${rString('^'+escaped+'$')})`;
      }
      await executeRPackage(s,p,'devtools',expression,'test');
    }},
    {id:'pytest', supports: async p => p.isPythonProject, run: async (p, file) => {
      const args = ['-m','pytest'];
      if (file) {
        const document = await savedDocument();
        const relative = path.relative(p.root.fsPath,document.uri.fsPath);
        if (document.languageId !== 'python' || relative === '..' || relative.startsWith('..'+path.sep) || path.isAbsolute(relative)) throw new UserError('Open a Python test file inside the selected project.');
        args.push(document.uri.fsPath);
      }
      await s.tasks.start(p.folder,'test',await s.runtime.executable('python',p.root),args);
    }}
  ];
}
export async function runTests(s: Services, currentFile = false): Promise<void> {
  if (currentFile) await savedDocument();
  if (!await vscode.workspace.saveAll(false)) throw new Cancelled();
  const project = await s.project();
  const preferred = vscode.workspace.getConfiguration('positronDeck',project.root).get<string>('testing.provider','auto');
  for (const provider of testingProviders(s)) {
    const supported = await provider.supports(project);
    if ((preferred === 'auto' && supported) || preferred === provider.id) {
      if (provider.id !== 'native' && !supported) throw new UserError(`The selected ${provider.id} test provider does not support this project.`);
      s.logger.log('info','provider.selected',{category:'testing',provider:provider.id});
      await provider.run(project,currentFile); return;
    }
  }
  throw new UserError('No test provider detected. Configure a VS Code Test Explorer provider, or use an R package or Python project. You can set positronDeck.testing.provider to native explicitly.');
}
