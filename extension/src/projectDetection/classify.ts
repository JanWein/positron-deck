import { ProjectFacts, ProjectFiles } from './types';
/** Bounded root-level heuristics, not a parser and not a recursive repository scan. */
export function classifyProject({names, contents}: ProjectFiles): ProjectFacts {
  const has = (name: string) => names.includes(name);
  const description = contents.DESCRIPTION ?? '';
  const python = ['app.py', 'main.py', 'streamlit_app.py'].map(n => contents[n] ?? '').join('\n');
  const imports = (module: string) => new RegExp(`^\\s*(?:from\\s+${module}(?:[.\\s])|import\\s+${module}(?:[.\\s,]|$))`, 'm').test(python);
  const isRPackage = /^Package:\s*\S+/m.test(description);
  return {
    isGitRepository: has('.git'), isRPackage,
    isRProject: isRPackage || names.some(n => /\.Rproj$/i.test(n)) || has('renv.lock') || names.some(n => /\.r$/i.test(n)),
    isPythonProject: has('pyproject.toml') || has('requirements.txt') || has('setup.py') || names.some(n => n.endsWith('.py')),
    isQuartoProject: has('_quarto.yml') || has('_quarto.yaml'),
    isShinyR: has('app.R') || (has('ui.R') && has('server.R')),
    isShinyPython: imports('shiny'), isStreamlit: imports('streamlit'), isFastAPI: imports('fastapi'),
  };
}
