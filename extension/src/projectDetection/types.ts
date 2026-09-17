import type * as vscode from 'vscode';
export interface ProjectFacts {
  isGitRepository: boolean; isRProject: boolean; isRPackage: boolean;
  isPythonProject: boolean; isQuartoProject: boolean; isShinyR: boolean;
  isShinyPython: boolean; isStreamlit: boolean; isFastAPI: boolean;
}
export interface Project extends ProjectFacts { folder: vscode.WorkspaceFolder; root: vscode.Uri }
export interface ProjectFiles { names: readonly string[]; contents: Readonly<Record<string, string>> }
