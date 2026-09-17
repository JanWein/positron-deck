import * as vscode from 'vscode';
import { Registry } from '../utils/register';
import { Services } from '../services';
import { appProviders, startApp } from '../providers/apps';
import { Cancelled, UserError } from '../utils/errors';
export function registerApps(registry: Registry,s: Services): void {
  registry.add('runApp',async () => {
    if (!await vscode.workspace.saveAll(false)) throw new Cancelled();
    const project = await s.project();
    const candidates = (await Promise.all(appProviders(s).map(p => p.detect(project)))).flat();
    if (!candidates.length) throw new UserError('No supported app found. Use app.R, ui.R/server.R, or app.py/main.py/streamlit_app.py with a Shiny, Streamlit or FastAPI import. FastAPI requires a named FastAPI() object.');
    const chosen = candidates.length === 1 ? candidates[0] : await vscode.window.showQuickPick(candidates,{placeHolder:'Choose the application to run'});
    if (!chosen) throw new Cancelled();
    await startApp(s,project,chosen);
  });
  registry.add('stopApp',async () => {
    const project = await s.project();
    if (await vscode.window.showWarningMessage('Stop the app started by Positron Deck in this project?',{modal:true},'Stop') !== 'Stop') throw new Cancelled();
    await s.tasks.stopApp(project.folder);
  });
}
