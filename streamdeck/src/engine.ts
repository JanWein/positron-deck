import {parseShortcut,ShortcutError,type Stroke} from './shortcuts.js';
export interface Preset { uuid:string; command:string; shortcut:string; fallback:string }
export type Settings = { mode?:string; shortcut?:string; delay?:number };
export interface KeySender { foreground(): string; send(stroke:Stroke):void }
export function resolveStrokes(preset:Preset,settings:Settings):Stroke[] {
  switch (settings.mode ?? 'default') {
    case 'default': return preset.shortcut.split(' ').map(parseShortcut);
    case 'fallback': return preset.fallback.split(' ').map(parseShortcut);
    case 'custom': return parseSequence(settings.shortcut ?? '');
    default: throw new ShortcutError('INVALID_MODE');
  }
}
export function parseSequence(value:string):Stroke[] {
  const parts=value.trim().replace(/\s*\+\s*/g,'+').split(/\s+/);
  if(parts.length<1 || parts.length>4 || value.length>200)throw new ShortcutError('INVALID_SHORTCUT');
  return parts.map(parseShortcut);
}
export class ShortcutEngine {
  private busy=false;
  private readonly lastPress=new Map<string,number>();
  constructor(private sender:KeySender,private pause:(ms:number)=>Promise<void> = ms=>new Promise(r=>setTimeout(r,ms))) {}
  async run(preset:Preset,settings:Settings,context:string):Promise<void> {
    if(this.busy)throw new ShortcutError('BUSY');
    const strokes=resolveStrokes(preset,settings);
    const previous=this.lastPress.get(context);
    if(previous!==undefined && Date.now()-previous<150)throw new ShortcutError('TOO_FAST');
    const window=this.sender.foreground();
    if(window==='0')throw new ShortcutError('NO_WINDOW');
    this.busy=true;this.lastPress.set(context,Date.now());
    try {
      for(let i=0;i<strokes.length;i++) {
        if(i) {
          const delay=typeof settings.delay==='number' && Number.isFinite(settings.delay) ? Math.max(50,Math.min(1000,settings.delay)):120;
          await this.pause(delay);
          if(this.sender.foreground()!==window)throw new ShortcutError('FOCUS_CHANGED');
        }
        this.sender.send(strokes[i]);
      }
    } finally {this.busy=false;}
  }
  forget(context:string):void {this.lastPress.delete(context);}
}
