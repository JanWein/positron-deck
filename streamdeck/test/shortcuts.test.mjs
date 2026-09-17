import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import koffi from 'koffi';
import {parseShortcut,keyEvents,encodeInputs,recoveryEvents} from '../.test-build/shortcuts.mjs';
import {ShortcutEngine,resolveStrokes} from '../.test-build/engine.mjs';
import {senderFromApi} from '../.test-build/windows.mjs';
const presets=JSON.parse(fs.readFileSync('src/actions.json','utf8'));
const p=presets[0];
test('all catalog presets match VSIX contributed commands and default keybindings',()=>{
 const extension=JSON.parse(fs.readFileSync('assets/extension-manifest.json','utf8'));
 assert.ok(presets.length>=190);assert.equal(new Set(presets.map(p=>p.uuid)).size,presets.length);
 for(const preset of presets){assert.ok(extension.contributes.commands.some(c=>c.command===preset.command));assert.equal(extension.contributes.keybindings.find(k=>k.command===preset.command).key,preset.shortcut);preset.shortcut.split(" ").forEach(parseShortcut);assert.equal(resolveStrokes(preset,{mode:'fallback'}).length,2)}
});
test('F13 through F24 use actual Windows virtual key values',()=>{for(let f=13;f<=24;f++)assert.equal(parseShortcut('ctrl+alt+shift+f'+f).key,0x7c+f-13)});
test('custom shortcut accepts modifiers and keys without shell evaluation',()=>{assert.deepEqual(parseShortcut(' Shift + CTRL + 1 '),{modifiers:[16,17],key:49});assert.equal(parseShortcut('alt+enter').key,13)});
test('invalid input, duplicate modifiers and prototype keys are rejected',()=>{for(const value of ['','f25','ctrl+ctrl+a','ctrl+$(cmd)','ctrl+__proto__','constructor','ctrl+alt','ctrl+shift+a b','ctrl++a'])assert.throws(()=>parseShortcut(value),e=>e.code==='INVALID_SHORTCUT')});
test('press/release order is symmetrical',()=>{
 const events=keyEvents(parseShortcut('ctrl+alt+shift+f13'));assert.deepEqual(events.map(e=>[e.vk,e.up]),[[17,false],[18,false],[16,false],[124,false],[124,true],[16,true],[18,true],[17,true]]);
});
test('INPUT byte layout matches Windows x64/ARM64 C structs',()=>{
 const ki=koffi.struct({wVk:'uint16_t',wScan:'uint16_t',dwFlags:'uint32_t',time:'uint32_t',dwExtraInfo:'uint64_t'});
 const mi=koffi.struct({dx:'int32_t',dy:'int32_t',mouseData:'uint32_t',dwFlags:'uint32_t',time:'uint32_t',dwExtraInfo:'uint64_t'});
 const input=koffi.struct({type:'uint32_t',data:koffi.union({ki,mi})});assert.equal(koffi.sizeof(input),40);assert.equal(koffi.offsetof(input,'data'),8);
 const b=encodeInputs([{vk:124,up:false},{vk:124,up:true}]);assert.equal(b.length,80);assert.equal(b.readUInt32LE(0),1);assert.equal(b.readUInt16LE(8),124);assert.equal(b.readUInt32LE(12),0);assert.equal(b.readUInt32LE(52),2);assert.equal(b.readBigUInt64LE(24),0n);
});
test('extended navigation keys set Windows extended flag',()=>{const b=encodeInputs([{vk:0x2e,up:false},{vk:0x2e,up:true}]);assert.equal(b.readUInt32LE(12),1);assert.equal(b.readUInt32LE(52),3)});
test('partial SendInput failure releases only keys pressed by this call',()=>{
 const calls=[];const sender=senderFromApi({keyState:()=>0,foreground:()=>12n,sendInput:(count,bytes,size)=>{calls.push({count,bytes,size});return calls.length===1?2:count}});
 assert.throws(()=>sender.send(parseShortcut(p.shortcut)),e=>e.code==='INPUT_BLOCKED');assert.equal(calls[1].count,2);assert.equal(calls[1].bytes.readUInt16LE(8),18);assert.equal(calls[1].bytes.readUInt16LE(48),17);assert.equal(calls[1].bytes.readUInt32LE(12),2);
});
test('zero accepted inputs cause no spurious key releases',()=>{let calls=0;const sender=senderFromApi({keyState:()=>0,foreground:()=>1,sendInput:()=>{calls++;return 0}});assert.throws(()=>sender.send(parseShortcut(p.shortcut)));assert.equal(calls,1)});
test('held physical modifiers prevent injection',()=>{let calls=0;const sender=senderFromApi({keyState:k=>k===0x11?0x8000:0,foreground:()=>1,sendInput:()=>{calls++;return 8}});assert.throws(()=>sender.send(parseShortcut(p.shortcut)),e=>e.code==='KEY_HELD');assert.equal(calls,0)});
test('successful injection uses one atomic SendInput call',()=>{const calls=[];const sender=senderFromApi({keyState:()=>0,foreground:()=>4n,sendInput:(n,b,size)=>{calls.push({n,b,size});return n}});sender.send(parseShortcut(p.shortcut));assert.equal(sender.foreground(),'4');assert.equal(calls.length,1);assert.equal(calls[0].n,8);assert.equal(calls[0].size,40)});
test('recovery after complete sequence does nothing',()=>{const e=keyEvents(parseShortcut(p.shortcut));assert.deepEqual(recoveryEvents(e,e.length),[])});
test('fallback sends prefix and suffix with configured delay',async()=>{const calls=[];const pauses=[];const engine=new ShortcutEngine({foreground:()=> '1',send:s=>calls.push(s)},async ms=>pauses.push(ms));await engine.run(p,{mode:'fallback',delay:200},'a');assert.deepEqual(pauses,[200]);assert.equal(calls[0].key,123);assert.equal(calls[1].key,65);assert.deepEqual(calls[1].modifiers,[])});
test('window switch during fallback prevents trailing character in wrong window',async()=>{let foreground='1';const calls=[];const e=new ShortcutEngine({foreground:()=>foreground,send:s=>calls.push(s)},async()=>{foreground='2'});await assert.rejects(e.run(p,{mode:'fallback'},'a'),x=>x.code==='FOCUS_CHANGED');assert.equal(calls.length,1)});
test('parallel sequences are rejected and a later press can run',async()=>{let resume;const e=new ShortcutEngine({foreground:()=> '1',send:()=>{}},()=>new Promise(r=>resume=r));const first=e.run(p,{mode:'fallback'},'a');await assert.rejects(e.run(p,{},'b'),x=>x.code==='BUSY');resume();await first;await e.run(p,{},'b')});
test('no foreground window and invalid mode never send keys',async()=>{let sent=0;const e=new ShortcutEngine({foreground:()=> '0',send:()=>sent++});await assert.rejects(e.run(p,{},'a'),x=>x.code==='NO_WINDOW');await assert.rejects(e.run(p,{mode:'bad'},'a'),x=>x.code==='INVALID_MODE');assert.equal(sent,0)});
test('rapid duplicate key events are debounced per action context',async()=>{let n=0;const e=new ShortcutEngine({foreground:()=> '1',send:()=>n++});await e.run(p,{},'a');await assert.rejects(e.run(p,{},'a'),x=>x.code==='TOO_FAST');await e.run(p,{},'b');assert.equal(n,2)});
test('custom mode sends the configured shortcut instead of preset',async()=>{const calls=[];const e=new ShortcutEngine({foreground:()=> '1',send:s=>calls.push(s)});await e.run(p,{mode:'custom',shortcut:'ctrl+alt+shift+1'},'a');assert.equal(calls[0].key,49)});
test('packaged native addons are Windows x64 and ARM64 binaries',()=>{for(const [arch,machine] of [['x64',0x8664],['arm64',0xaa64]]){const b=fs.readFileSync(`org.positron-deck.shortcuts.sdPlugin/node_modules/koffi/build/koffi/win32_${arch}/koffi.node`);assert.equal(b.toString('ascii',0,2),'MZ');const pe=b.readUInt32LE(0x3c);assert.equal(b.toString('ascii',pe,pe+4),'PE\0\0');assert.equal(b.readUInt16LE(pe+4),machine)}});

test('new default chord is sent as two strokes',async()=>{const calls=[];const e=new ShortcutEngine({foreground:()=> '1',send:s=>calls.push(s)},async()=>{});await e.run(presets[32],{},'chord');assert.equal(calls.length,2);assert.equal(calls[0].key,112)});
test('custom chords normalize modifiers and reject excessive length',()=>{assert.equal(resolveStrokes(p,{mode:'custom',shortcut:'ctrl + k ctrl+s'}).length,2);assert.throws(()=>resolveStrokes(p,{mode:'custom',shortcut:'a b c d e'}))});
