import * as vscode from 'vscode';
import * as path from 'node:path';
import { Services } from '../../services';
import { Project } from '../../projectDetection/types';
import { AppCandidate, AppProvider } from './types';
import { UserError } from '../../utils/errors';
import { requireRPackage, rString } from '../../utils/rCode';
async function pythonCandidates(project: Project, provider: string, module: string): Promise<AppCandidate[]> {
  const results: AppCandidate[] = [];
  for (const entrypoint of ['app.py','main.py','streamlit_app.py']) {
    const uri = vscode.Uri.joinPath(project.root,entrypoint);
    let content: string;
    try {
      if ((await vscode.workspace.fs.stat(uri)).size > 512*1024) continue;
      content = new TextDecoder().decode(await vscode.workspace.fs.readFile(uri));
    } catch { continue; }
    if (!new RegExp(`^\\s*(?:from\\s+${module}(?:[.\\s])|import\\s+${module}(?:[.\\s,]|$))`,'m').test(content)) continue;
    const object = module === 'fastapi' ? content.match(/^\s*([A-Za-z_]\w*)\s*(?::[^=\n]+)?=\s*(?:fastapi\.)?FastAPI\s*\(/m)?.[1] : undefined;
    // A module import alone is not enough to guess an ASGI app/factory.
    if (module === 'fastapi' && !object) continue;
    results.push({provider,label:`${provider}: ${entrypoint}`,entrypoint,object});
  }
  return results;
}
export function appProviders(s: Services): AppProvider[] {
  const python = (id: string, module: string, args: (candidate: AppCandidate) => string[]): AppProvider => ({
    id, detect:p => pythonCandidates(p,id,module), run:async (p,c) => { await s.tasks.start(p.folder,'app',await s.runtime.executable('python',p.root),args(c)); }
  });
  return [
    {id:'shinyR',detect:async p => p.isShinyR ? [{provider:'shinyR',label:'R Shiny',entrypoint:p.root.fsPath}] : [],run:async (p) => {
      const code = requireRPackage('shiny',`shiny::runApp(${rString(p.root.fsPath)}, launch.browser=FALSE)`);
      await s.tasks.start(p.folder,'app',await s.runtime.executable('r',p.root),['--vanilla','--slave','-e',code]);
    }},
    python('shinyPython','shiny',c => ['-m','shiny','run',c.entrypoint]),
    python('streamlit','streamlit',c => ['-m','streamlit','run',c.entrypoint,'--server.headless=true']),
    python('fastapi','fastapi',c => ['-m','uvicorn',`${path.basename(c.entrypoint,'.py')}:${c.object}`]),
  ];
}
export async function startApp(s: Services, project: Project, candidate: AppCandidate): Promise<void> {
  const provider = appProviders(s).find(p => p.id === candidate.provider);
  if (!provider) throw new UserError('Unsupported application provider.');
  s.logger.log('info','provider.selected',{category:'apps',provider:provider.id});
  await provider.run(project,candidate);
}
