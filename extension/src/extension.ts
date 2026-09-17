import * as vscode from 'vscode';
import { Services } from './services';
import { Registry } from './utils/register';
import { DeckState } from './utils/state';
import { registerCode } from './commands/code';
import { registerNavigation } from './commands/navigation';
import { registerGit } from './commands/git';
import { registerTesting } from './commands/testing';
import { registerRPackage } from './commands/rPackage';
import { registerQuarto } from './commands/quarto';
import { registerApps } from './commands/apps';
import { registerDeploy } from './commands/deploy';
import { registerCatalog } from './commands/catalog';
import { registerWorkflows } from './commands/workflows';
export function activate(context: vscode.ExtensionContext) {
  const services = new Services(); const state = new DeckState();
  context.subscriptions.push(services,state);
  const registry = new Registry(context,services.logger,state);
  registerCode(registry,services); registerNavigation(registry,services);
  registerGit(registry,services); registerTesting(registry,services);
  registerRPackage(registry,services); registerQuarto(registry,services);
  registerApps(registry,services); registerDeploy(registry,services);
  registerCatalog(registry,services); registerWorkflows(registry,services);
  return {onDidChange:state.onDidChange, getState:() => state.snapshot()};
}
