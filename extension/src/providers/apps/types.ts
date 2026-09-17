import { Project } from '../../projectDetection/types';
export interface AppCandidate { provider: string; label: string; entrypoint: string; object?: string }
export interface AppProvider { id: string; detect(project: Project): Promise<AppCandidate[]>; run(project: Project, candidate: AppCandidate): Promise<void> }
