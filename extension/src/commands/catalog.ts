import * as vscode from 'vscode';
import catalog from '../catalog.json';
import { Registry } from '../utils/register';
import { Services } from '../services';
import { Cancelled, UserError } from '../utils/errors';
export function registerCatalog(registry: Registry, s: Services): void {
  for (const item of catalog.filter(a => a.kind === 'delegate')) {
    registry.add(item.id, async () => {
      if (item.confirm && await vscode.window.showWarningMessage(item.confirm, {modal:true}, 'Continue') !== 'Continue') throw new Cancelled();
      for (const target of item.targets) {
        if (await s.bridge.available(target,item.extension || undefined)) return s.bridge.run(target);
      }
      throw new UserError(`${item.name} is not available in this IDE. Required host: ${item.host}. Check the installed Positron version, optional views and extensions. Run Check Action Availability for details.`);
    }, item.trusted);
  }
}
