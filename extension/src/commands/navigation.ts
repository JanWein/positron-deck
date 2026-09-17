import { Registry } from '../utils/register';
import { Services } from '../services';
export function registerNavigation(registry: Registry, s: Services): void {
  const actions: Record<string,string> = {
    openTerminal:'workbench.action.terminal.focus',openConsole:'workbench.action.positronConsole.focusConsole',
    openSourceControl:'workbench.view.scm',openProblems:'workbench.actions.view.problems',commandPalette:'workbench.action.showCommands'
  };
  for (const [name,id] of Object.entries(actions)) registry.add(name,() => s.bridge.run(id),false);
  registry.add('showLog',async () => { s.logger.show(); },false);
}
