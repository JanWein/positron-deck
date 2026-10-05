import streamDeck from '@elgato/streamdeck';
import {readFileSync} from 'node:fs';
import {functionImage} from './presentation.js';
import {resolvePreset,groups} from './grouping.js';
import {ShortcutEngine,type Settings} from './engine.js';
import {createWindowsSender} from './windows.js';
import {ShortcutError} from './shortcuts.js';
let engine:ShortcutEngine|undefined;
let startupError='';
try {engine=new ShortcutEngine(createWindowsSender());}
catch(error) {startupError=error instanceof ShortcutError ? error.code:'NATIVE_LOAD_FAILED';streamDeck.logger.error(startupError);}
streamDeck.actions.onKeyDown<Settings>(event=>{
  void (async()=>{
    try {
      const preset=resolvePreset(event.action.manifestId,event.payload.settings);
      if(!engine)throw new ShortcutError(startupError);
      await engine.run(preset,event.payload.settings,event.action.id);
      streamDeck.logger.info(`hotkey.sent ${preset.command}`);
    } catch(error) {
      const code=error instanceof ShortcutError ? error.code:'UNEXPECTED_ERROR';
      streamDeck.logger.warn(`hotkey.failed ${code}`);
      await event.action.showAlert();
    }
  })().catch(()=>streamDeck.logger.error('feedback.failed'));
});
async function refresh(event: {action: {manifestId:string;setTitle:(title:string,options?:{target:number})=>Promise<unknown>;setImage:(path:string,options?:{target:number})=>Promise<unknown>};payload:{settings:Settings}}) {
  if(!groups.some(g=>g.uuid===event.action.manifestId))return;
  const preset=resolvePreset(event.action.manifestId,event.payload.settings);
  const svg=readFileSync(new URL(`../imgs/${preset.id}-key.svg`,import.meta.url),'utf8');
  const image = `data:image/svg+xml;base64,${Buffer.from(functionImage(svg,preset),'utf8').toString('base64')}`;
  // Target 0 updates both the physical key and the Stream Deck software preview.
  await Promise.all([event.action.setTitle(preset.title,{target:0}),event.action.setImage(image,{target:0})]);
}
streamDeck.actions.onWillAppear<Settings>(event=>{void refresh(event).catch(()=>streamDeck.logger.warn('selection.refresh.failed'));});
streamDeck.settings.onDidReceiveSettings<Settings>(event=>{void refresh(event).catch(()=>streamDeck.logger.warn('selection.refresh.failed'));});
streamDeck.actions.onWillDisappear(event=>engine?.forget(event.action.id));
streamDeck.connect().catch(()=>streamDeck.logger.error('streamdeck.connection.failed'));
