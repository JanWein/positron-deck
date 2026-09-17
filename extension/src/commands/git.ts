import * as vscode from 'vscode';
import { Registry } from '../utils/register';
import { Services } from '../services';
export function registerGit(registry: Registry, s: Services): void {
  const actions: Record<string,string> = {gitStageAll:'git.stageAll',gitCommit:'git.commit',gitPull:'git.pull',gitPush:'git.push',gitSync:'git.sync',gitCheckout:'git.checkout'};
  // No repository argument: the built-in Git extension owns repository selection
  // and prompts when several repositories are available, as in its command palette.
  for (const [name,id] of Object.entries(actions)) registry.add(name,async () => {
    if (name === 'gitCommit') await s.bridge.run('workbench.view.scm');
    await s.bridge.run(id,[],'vscode.git');
  });
  registry.add('gitShowDiff', async () => {
    await s.bridge.run('workbench.view.scm');
    const uri = vscode.window.activeTextEditor?.document.uri;
    if (uri) await s.bridge.run('git.openChange',[uri],'vscode.git');
  },false);
  registry.add('gitOpenLog',() => s.bridge.run('workbench.scm.history.focus'),false);
}
