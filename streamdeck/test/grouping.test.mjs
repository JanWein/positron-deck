import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {resolvePreset,groups} from '../.test-build/grouping.mjs';
const actions=JSON.parse(fs.readFileSync('src/actions.json'));
test('all commands remain selectable and old UUIDs retain their mapping',()=>{
 assert.equal(groups.length,14);
 for(const action of actions){
  assert.equal(resolvePreset(action.uuid,{command:'invalid'}).command,action.command);
  assert.ok(groups.some(g=>g.commands.includes(action.command)),action.command);
 }
 for(const group of groups)for(const command of group.commands)assert.equal(resolvePreset(group.uuid,{command}).command,command);
 assert.throws(()=>resolvePreset(groups[0].uuid,{command:'positronDeck.gitPush'}));
 assert.throws(()=>resolvePreset(groups[0].uuid,{command:''}));
});
test('manifest has 14 visible groups and hidden legacy actions',()=>{
 const manifest=JSON.parse(fs.readFileSync('org.positron-deck.shortcuts.sdPlugin/manifest.json'));
 assert.equal(manifest.Actions.filter(a=>a.VisibleInActionsList!==false).length,14);
 assert.equal(manifest.Actions.filter(a=>a.VisibleInActionsList===false).length,192);
 assert.equal(new Set(manifest.Actions.map(a=>a.UUID)).size,206);
});
test('grouped inspector selects functions, filters Python and persists selections',async()=>{
 const elements=new Map(),handlers=new Map(),outgoing=[];let socket;
 function element(id){if(!elements.has(id))elements.set(id,{dataset:{},value:'',textContent:'',hidden:false,children:[],replaceChildren(...c){this.children=c},addEventListener:(ev,fn)=>handlers.set(id+':'+ev,fn)});return elements.get(id);}
 class WebSocket{static OPEN=1;readyState=1;constructor(){socket=this}send(v){outgoing.push(JSON.parse(v))}}
 const scope={window:{},document:{getElementById:element,createElement:()=>({})},WebSocket,fetch:async url=>({json:async()=>url==='actions.json'?actions:groups})};
 vm.runInNewContext(fs.readFileSync('org.positron-deck.shortcuts.sdPlugin/ui/inspector.js','utf8'),scope);
 const group=groups.find(g=>g.id==='language');
 await scope.window.connectElgatoStreamDeckSocket('123','pi','registerPropertyInspector','{}',JSON.stringify({action:group.uuid,context:'key',payload:{settings:{command:'positronDeck.rCheck'}}}));
 socket.onopen();
 element('language').value='python';handlers.get('language:change')();
 assert.equal(outgoing.at(-1).payload.language,'python');
 assert.ok(!element('operation').children.some(o=>o.value==='positronDeck.rCheck'));
 element('operation').value='positronDeck.runFile';handlers.get('operation:change')();
 assert.equal(outgoing.at(-1).payload.command,'positronDeck.runFile');
 assert.equal(outgoing.at(-1).action,group.uuid);
 assert.equal(element('effective').textContent,actions.find(a=>a.id==='runFile').shortcut);
 socket.onmessage({data:JSON.stringify({event:'didReceiveSettings',context:'key',payload:{settings:{command:'positronDeck.test',language:'python',mode:'fallback'}}})});
 assert.equal(element('operation').value,'positronDeck.test');
});

async function openInspector(group, saved={}, connecting=false){
 const elements=new Map(),handlers=new Map(),outgoing=[];let socket;
 function element(id){
  if(!elements.has(id))elements.set(id,{dataset:{},value:'',textContent:'',hidden:false,children:[],rebuilds:0,
   replaceChildren(...children){this.children=children;this.value=children[0]?.value||'';this.rebuilds++},
   addEventListener:(event,fn)=>handlers.set(id+':'+event,fn)});
  return elements.get(id);
 }
 class WebSocket{static OPEN=1;readyState=connecting?0:1;constructor(){socket=this}send(value){outgoing.push(JSON.parse(value))}}
 const scope={window:{},document:{getElementById:element,createElement:()=>({})},WebSocket,fetch:async url=>({json:async()=>url==='actions.json'?actions:groups})};
 vm.runInNewContext(fs.readFileSync('org.positron-deck.shortcuts.sdPlugin/ui/inspector.js','utf8'),scope);
 await scope.window.connectElgatoStreamDeckSocket('123','pi','registerPropertyInspector','{}',JSON.stringify({action:group.uuid,context:'key',payload:{settings:saved}}));
 return {element,handlers,outgoing,socket,select(command){element('operation').value=command;handlers.get('operation:change')()}};
}
test('every group retains repeated selections without rebuilding the native dropdown',async()=>{
 for(const group of groups){
  const ui=await openInspector(group);ui.socket.onopen();
  assert.deepEqual(ui.outgoing.map(m=>m.event),['registerPropertyInspector']);
  for(const command of group.commands){
   ui.select(command);
   assert.equal(ui.element('operation').value,command,group.name);
   assert.equal(ui.outgoing.at(-1).payload.command,command,group.name);
   assert.equal(ui.element('operation').rebuilds,1,group.name);
  }
  const stored=ui.outgoing.at(-1).payload;
  const reopened=await openInspector(group,stored);
  assert.equal(reopened.element('operation').value,stored.command,group.name);
 }
});
test('selection made while websocket connects is saved after registration',async()=>{
 const group=groups.find(g=>g.id==='navigation');const ui=await openInspector(group,{},true);
 const command=group.commands[2];ui.select(command);
 assert.equal(ui.element('operation').value,command);assert.equal(ui.outgoing.length,0);
 ui.socket.onmessage({data:JSON.stringify({event:'didReceiveSettings',context:'key',payload:{settings:{}}})});
 assert.equal(ui.element('operation').value,command);
 ui.socket.readyState=1;ui.socket.onopen();
 assert.equal(ui.outgoing[0].event,'registerPropertyInspector');
 assert.equal(ui.outgoing[1].event,'setSettings');assert.equal(ui.outgoing[1].payload.command,command);
 assert.equal(ui.outgoing.some(m=>m.event==='getSettings'),false);
});
