import actions from './actions.json' with {type:'json'};
import groups from './groups.json' with {type:'json'};
import {ShortcutError} from './shortcuts.js';
import type {Settings} from './engine.js';
export {groups};
export function resolvePreset(manifestId:string,settings:Settings) {
  const legacy=actions.find(a=>a.uuid===manifestId);
  if(legacy)return legacy;
  const group=groups.find(g=>g.uuid===manifestId);
  if(!group)throw new ShortcutError('UNKNOWN_ACTION');
  const command=settings.command??group.defaultCommand;
  if(!group.commands.includes(command))throw new ShortcutError('INVALID_ACTION_SELECTION');
  const preset=actions.find(a=>a.command===command);
  if(!preset)throw new ShortcutError('UNKNOWN_ACTION');
  return preset;
}
