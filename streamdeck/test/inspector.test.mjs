import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
test('property inspector saves and reads back settings through its registered connection',async()=>{
 const elements=new Map();const handlers=new Map();const outgoing=[];let socket;
 const presets=JSON.parse(fs.readFileSync('src/actions.json','utf8'));
 function element(id){if(!elements.has(id))elements.set(id,{dataset:{},value:'',textContent:'',hidden:false,replaceChildren:(...children)=>{},addEventListener:(event,fn)=>handlers.set(id+':'+event,fn)});return elements.get(id)}
 class WebSocket{static OPEN=1;readyState=1;constructor(url){socket=this;assert.equal(url,'ws://127.0.0.1:12345')}send(value){outgoing.push(JSON.parse(value))}}
 const scope={window:{},document:{getElementById:element,createElement:()=>({})},WebSocket,fetch:async url=>({json:async()=>url==='actions.json'?presets:[]})};
 vm.runInNewContext(fs.readFileSync('org.positron-deck.shortcuts.sdPlugin/ui/inspector.js','utf8'),scope);
 await scope.window.connectElgatoStreamDeckSocket('12345','inspector-id','registerPropertyInspector','{}',JSON.stringify({action:presets[0].uuid,context:'button-id',payload:{settings:{}}}));
 socket.onopen();assert.deepEqual(outgoing[0],{event:'registerPropertyInspector',uuid:'inspector-id'});assert.equal(outgoing.length,1); // No stale bootstrap getSettings request.
 element('mode').value='custom';element('shortcut').value='ctrl+alt+shift+1';element('delay').value='120';handlers.get('mode:change')();
 assert.deepEqual(outgoing.at(-2),{event:'setSettings',context:'inspector-id',payload:{mode:'custom',shortcut:'ctrl+alt+shift+1',delay:120}});assert.deepEqual(outgoing.at(-1),{event:'getSettings',context:'inspector-id'});socket.onmessage({data:JSON.stringify({event:'didReceiveSettings',context:'button-id',payload:{settings:outgoing.at(-2).payload}})});assert.equal(element('customGroup').hidden,false);assert.equal(element('effective').textContent,'ctrl+alt+shift+1');
 socket.onmessage({data:JSON.stringify({event:'didReceiveSettings',context:'button-id',payload:{settings:{mode:'fallback',delay:250}}})});assert.equal(element('delayGroup').hidden,false);assert.equal(element('delay').value,'250');
 handlers.get('reset:click')();assert.equal(outgoing.at(-2).payload.mode,'default');assert.equal(element('effective').textContent,presets[0].shortcut);
});
