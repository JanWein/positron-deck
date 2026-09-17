import * as vscode from 'vscode';
import { Registry } from '../utils/register';
import { Services } from '../services';
import { deploymentProviders } from '../providers/deployment';
import { Cancelled, UserError } from '../utils/errors';
export function registerDeploy(registry: Registry,s: Services): void {
  registry.add('deploy',async () => {
    const project = await s.project();
    const config = vscode.workspace.getConfiguration('positronDeck',project.root);
    const id = config.get<string>('deploy.provider','none');
    const provider = deploymentProviders(s).find(p => p.id === id);
    if (!provider) throw new UserError('Choose a deployment provider in positronDeck.deploy.provider: positPublisher, git, task or custom.');
    const plan = await provider.prepare(project);
    // Custom shell commands always need confirmation, even when routine deploy
    // confirmations are disabled, because workspace configuration controls them.
    if ((id === 'custom' || config.get('confirmDeploy',true)) && await vscode.window.showWarningMessage(`Deploy with ${id}? ${plan.description}`,{modal:true},'Deploy') !== 'Deploy') throw new Cancelled();
    if (!await vscode.workspace.saveAll(false)) throw new Cancelled();
    s.logger.log('info','provider.selected',{category:'deployment',provider:id});
    await plan.execute();
  });
}
