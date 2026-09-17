import * as vscode from 'vscode';
import { CommandBridge } from './utils/commands';
import { Logger } from './utils/logger';
import { RuntimeAdapter } from './adapters/runtime';
import { TaskRunner } from './utils/tasks';
import { detectProject } from './projectDetection/detectProject';
export class Services implements vscode.Disposable {
  readonly logger = new Logger();
  readonly bridge = new CommandBridge();
  readonly runtime = new RuntimeAdapter(this.bridge);
  readonly tasks = new TaskRunner(this.logger);
  project() { return detectProject(this.logger); }
  dispose(): void { this.tasks.dispose(); this.logger.dispose(); }
}
