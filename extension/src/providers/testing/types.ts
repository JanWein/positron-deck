import { Project } from '../../projectDetection/types';
export interface TestingProvider { id: string; supports(project: Project): Promise<boolean>; run(project: Project, currentFile: boolean): Promise<void> }
