import { Registry } from '../utils/register';
import { Services } from '../services';
import { runTests } from '../providers/testing';
export function registerTesting(registry: Registry,s: Services): void {
  registry.add('test',() => runTests(s)); registry.add('testCurrentFile',() => runTests(s,true));
}
