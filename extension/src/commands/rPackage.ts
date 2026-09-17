import * as vscode from 'vscode';
import { Registry } from '../utils/register';
import { Services } from '../services';
import { Project } from '../projectDetection/types';
import { Cancelled, UserError } from '../utils/errors';
import { requireRPackage, rString } from '../utils/rCode';
export async function executeRPackage(s: Services, project: Project, name: string, expression: string, kind = 'r-package'): Promise<void> {
  if (!project.isRPackage) throw new UserError('This action requires an R package with a Package field in DESCRIPTION.');
  const code = requireRPackage(name,expression);
  if (s.runtime.positron) await s.runtime.execute('r',code);
  else if (await s.bridge.available('r.runCommand','REditorSupport.r')) await s.bridge.run('r.runCommand',[code]);
  else if (kind === 'rLoadAll') throw new UserError('Load All needs Positron or the VS Code R extension so the package remains loaded in an interactive session.');
  else await s.tasks.start(project.folder,kind,await s.runtime.executable('r',project.root),['--vanilla','--slave','-e',code]);
}
export function registerRPackage(registry: Registry,s: Services): void {
  const actions: Record<string,{pkg:string;fn:string;arg:string}> = {
    rTest:{pkg:'devtools',fn:'test',arg:'pkg'},rCheck:{pkg:'devtools',fn:'check',arg:'pkg'},
    rDocument:{pkg:'devtools',fn:'document',arg:'pkg'},rLoadAll:{pkg:'devtools',fn:'load_all',arg:'path'},
    rStyle:{pkg:'styler',fn:'style_pkg',arg:'pkg'},rLint:{pkg:'lintr',fn:'lint_package',arg:'path'}
  };
  for (const [name, action] of Object.entries(actions)) registry.add(name,async () => {
    const project = await s.project();
    if (!project.isRPackage) throw new UserError('Open an R package project first.');
    if (['rStyle','rDocument'].includes(name) && await vscode.window.showWarningMessage(`${name === 'rStyle' ? 'Reformat package source files' : 'Regenerate package documentation and NAMESPACE'}? Review or commit your current changes first.`,{modal:true},'Continue') !== 'Continue') throw new Cancelled();
    if (!await vscode.workspace.saveAll(false)) throw new Cancelled();
    const expression = `${action.pkg}::${action.fn}(${action.arg}=${rString(project.root.fsPath)})`;
    await executeRPackage(s,project,action.pkg,expression,name === 'rTest' ? 'test' : name);
  });
}
