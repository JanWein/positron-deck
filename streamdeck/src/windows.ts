import {createRequire} from 'node:module';
import {keyEvents,encodeInputs,recoveryEvents,ShortcutError,type Stroke} from './shortcuts.js';
import type {KeySender} from './engine.js';
export interface WindowsApi {sendInput(count:number,bytes:Buffer,size:number):number; keyState(vk:number):number; foreground():number|bigint}
const modifierKeys=[0x10,0x11,0x12,0x5b,0x5c,0xa0,0xa1,0xa2,0xa3,0xa4,0xa5];
export function senderFromApi(api:WindowsApi):KeySender {
  return {
    foreground:()=>String(api.foreground()),
    send(stroke:Stroke):void {
      // Avoid releasing keys held on the physical keyboard or sending altered chords.
      if([...modifierKeys,stroke.key].some(vk=>(api.keyState(vk)&0x8000)!==0))throw new ShortcutError('KEY_HELD');
      const events=keyEvents(stroke);
      const accepted=api.sendInput(events.length,encodeInputs(events),40);
      if(accepted!==events.length) {
        const recovery=recoveryEvents(events,Math.max(0,Math.min(events.length,accepted)));
        if(recovery.length)api.sendInput(recovery.length,encodeInputs(recovery),40);
        throw new ShortcutError('INPUT_BLOCKED');
      }
    }
  };
}
export function createWindowsSender():KeySender {
  if(process.platform!=='win32' || !['x64','arm64'].includes(process.arch))throw new ShortcutError('WINDOWS_REQUIRED');
  const require=createRequire(import.meta.url);
  const koffi=require('koffi') as typeof import('koffi');
  const user32=koffi.load('user32.dll');
  const sendInput=user32.func('uint32_t __stdcall SendInput(uint32_t count, const void *inputs, int size)');
  const keyState=user32.func('int16_t __stdcall GetAsyncKeyState(int key)');
  const foreground=user32.func('uintptr_t __stdcall GetForegroundWindow()');
  return senderFromApi({sendInput,keyState,foreground});
}
