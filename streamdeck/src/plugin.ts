import streamDeck from '@elgato/streamdeck';
import presets from './actions.json' with {type:'json'};
import {ShortcutEngine,type Settings} from './engine.js';
import {createWindowsSender} from './windows.js';
import {ShortcutError} from './shortcuts.js';
let engine:ShortcutEngine|undefined;
let startupError='';
try {engine=new ShortcutEngine(createWindowsSender());}
catch(error) {startupError=error instanceof ShortcutError ? error.code:'NATIVE_LOAD_FAILED';streamDeck.logger.error(startupError);}
const lookup=new Map(presets.map(p=>[p.uuid,p]));
streamDeck.actions.onKeyDown<Settings>(event=>{
  void (async()=>{
    try {
      const preset=lookup.get(event.action.manifestId);
      if(!preset)throw new ShortcutError('UNKNOWN_ACTION');
      if(!engine)throw new ShortcutError(startupError);
      await engine.run(preset,event.payload.settings,event.action.id);
      // There is no IDE acknowledgement. This only records successful input injection.
      streamDeck.logger.info(`hotkey.sent ${preset.command}`);
    } catch(error) {
      const code=error instanceof ShortcutError ? error.code:'UNEXPECTED_ERROR';
      streamDeck.logger.warn(`hotkey.failed ${code}`);
      await event.action.showAlert();
    }
  })().catch(()=>streamDeck.logger.error('feedback.failed'));
});
streamDeck.actions.onWillDisappear(event=>engine?.forget(event.action.id));
streamDeck.connect().catch(()=>streamDeck.logger.error('streamdeck.connection.failed'));
