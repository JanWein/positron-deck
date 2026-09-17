export interface Stroke { modifiers: number[]; key: number }
export interface KeyEvent { vk: number; up: boolean }
export class ShortcutError extends Error { constructor(readonly code: string) { super(code); } }
const modifiers: Record<string,number> = {ctrl:0x11,alt:0x12,shift:0x10,win:0x5b};
const keys: Record<string,number> = {enter:0x0d,escape:0x1b,tab:0x09,space:0x20,backspace:0x08,delete:0x2e,insert:0x2d,home:0x24,end:0x23,pageup:0x21,pagedown:0x22,left:0x25,up:0x26,right:0x27,down:0x28};
export function parseShortcut(value: string): Stroke {
  if (typeof value !== 'string' || value.length > 100) throw new ShortcutError('INVALID_SHORTCUT');
  const tokens = value.toLowerCase().trim().split('+').map(x=>x.trim());
  const key = tokens.pop() ?? '';
  if (tokens.some(t=>!Object.hasOwn(modifiers,t)) || new Set(tokens).size !== tokens.length) throw new ShortcutError('INVALID_SHORTCUT');
  let vk: number | undefined = Object.hasOwn(keys,key) ? keys[key] : undefined;
  if (/^[a-z0-9]$/.test(key)) vk = key.toUpperCase().charCodeAt(0);
  const f = /^f([1-9]|1\d|2[0-4])$/.exec(key);
  if (f) vk = 0x70 + Number(f[1]) - 1;
  if (vk === undefined) throw new ShortcutError('INVALID_SHORTCUT');
  return {modifiers:tokens.map(t=>modifiers[t]),key:vk};
}
export function keyEvents(stroke: Stroke): KeyEvent[] {
  const down = [...stroke.modifiers,stroke.key];
  return [...down.map(vk=>({vk,up:false})),...down.toReversed().map(vk=>({vk,up:true}))];
}
/** Native INPUT is 40 bytes on Windows x64/ARM64. The union starts at byte 8. */
export function encodeInputs(events: KeyEvent[]): Buffer {
  const buffer = Buffer.alloc(events.length * 40);
  events.forEach((event,i)=>{
    const base=i*40;buffer.writeUInt32LE(1,base); // INPUT_KEYBOARD
    buffer.writeUInt16LE(event.vk,base+8);
    const extended=[0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x2d,0x2e,0x5b,0x5c].includes(event.vk);
    buffer.writeUInt32LE((event.up ? 2 : 0) | (extended ? 1 : 0),base+12); // KEYEVENTF_KEYUP
  });
  return buffer;
}
/** Only release keys actually pressed by this injection if SendInput partially failed. */
export function recoveryEvents(events: KeyEvent[], accepted: number): KeyEvent[] {
  const pressed = new Set<number>();
  for (const event of events.slice(0,accepted)) { if(event.up)pressed.delete(event.vk);else pressed.add(event.vk); }
  return [...pressed].toReversed().map(vk=>({vk,up:true}));
}
