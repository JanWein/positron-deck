import { Project } from '../../projectDetection/types';
export interface DeploymentPlan { description: string; execute(): Promise<void> }
export interface DeploymentProvider { id: string; prepare(project: Project): Promise<DeploymentPlan> }
