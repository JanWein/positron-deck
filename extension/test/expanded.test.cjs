const test=require('node:test');const assert=require('node:assert/strict');const {host}=require('./host.cjs');
const catalog=require('../src/catalog.json');const manifest=require('../package.json');
test('catalog and registration cover every action with unique prefix-safe hotkeys',()=>{
 const h=host();try{require('../out/extension').activate(h.context);assert.equal(h.registered.size,catalog.length);assert.ok(catalog.length>=190);
 for(const a of catalog){assert.ok(h.registered.has(a.command),a.command);assert.ok(manifest.contributes.commands.some(c=>c.command===a.command));}
 const keys=manifest.contributes.keybindings.map(k=>k.key);assert.equal(new Set(keys).size,keys.length);for(const k of keys)assert.ok(!keys.some(x=>x!==k&&x.startsWith(k+' ')),k);
 }finally{h.restore()}
});
test('new navigation delegates without trust while execution is blocked',async()=>{
 const h=host({trusted:false,available:['workbench.view.explorer','workbench.action.positronConsole.executeCodeBeforeCursor']});try{require('../out/extension').activate(h.context);await h.registered.get('positronDeck.openExplorer')();await h.registered.get('positronDeck.runToCursor')();assert.ok(h.calls.some(c=>c.id==='workbench.view.explorer'));assert.ok(!h.calls.some(c=>c.id==='workbench.action.positronConsole.executeCodeBeforeCursor'));assert.match(h.messages[0],/Trust/);}finally{h.restore()}
});
test('native Ctrl+Enter command takes precedence over raw line execution',async()=>{
 const h=host({available:['workbench.action.positronConsole.executeCode'],positron:{runtime:{executeCode:async()=>{},getForegroundSession:async()=>undefined}}});try{require('../out/extension').activate(h.context);await h.registered.get('positronDeck.runSelection')();assert.ok(h.calls.some(c=>c.id==='workbench.action.positronConsole.executeCode'));assert.deepEqual(h.messages,[]);}finally{h.restore()}
});
test('missing native commands give an actionable error',async()=>{
 const h=host();try{require('../out/extension').activate(h.context);await h.registered.get('positronDeck.openDataConnections')();assert.match(h.messages[0],/not available/);}finally{h.restore()}
});
test('save cancellation prevents run and format failure prevents save',async()=>{
 const h=host();try{require('../out/extension').activate(h.context);let saves=0;h.document.save=async()=>{saves++;return false;};await h.registered.get('positronDeck.saveAndRun')();assert.equal(h.taskRuns.length,0);assert.equal(saves,1);await h.registered.get('positronDeck.formatAndSave')();assert.equal(saves,1);assert.match(h.messages[0],/unavailable/);}finally{h.restore()}
});
test('workflow validation rejects recursion, invalid steps and oversized chains before running',()=>{
 const h=host();try{const {validateWorkflow}=require('../out/commands/workflows');for(const w of [null,{name:'',steps:[]},{name:'x',steps:[{command:'positronDeck.workflowSlot1'}]},{name:'x',steps:[{command:'positronDeck.saveAndRun'}]},{name:'x',steps:[{save:'all',task:'x'}]},{name:'x',steps:Array(33).fill({save:'all'})}])assert.throws(()=>validateWorkflow(w));}finally{h.restore()}
});
test('custom workflow cancellation does not execute any step',async()=>{
 const h=host({config:{workflows:[{name:'Example',steps:[{command:'git.push'}]}],workflowSlots:['Example']}});try{require('../out/extension').activate(h.context);await h.registered.get('positronDeck.workflowSlot1')();assert.ok(!h.calls.some(c=>c.id==='git.push'));}finally{h.restore()}
});
test('finite task gate waits for success and stops the chain on nonzero exit',async()=>{
 for(const exitCode of [0,1]){
 const task={name:'Validate',isBackground:false};const h=host({tasks:[task]});try{
 let processEnd;h.vscode.tasks.onDidEndTaskProcess=cb=>{processEnd=cb;return{dispose(){}}};
 const {runWorkflow}=require('../out/commands/workflows');const {Services}=require('../out/services');const s=new Services();let next=0;const registry={invoke:async()=>{next++}};
 let gate;h.vscode.tasks.executeTask=async()=>{gate={task};return gate;};
 const done=runWorkflow({name:'Gate',steps:[{task:'Validate'},{command:'git.push'}]},registry,s);
 await new Promise(r=>setImmediate(r));assert.ok(!h.calls.some(c=>c.id==='git.push'));
 processEnd({execution:gate,exitCode});if(exitCode===0){await done;assert.ok(h.calls.some(c=>c.id==='git.push'));}else{await assert.rejects(done,/Remaining workflow/);assert.ok(!h.calls.some(c=>c.id==='git.push'));}assert.equal(next,0);s.dispose();
 }finally{h.restore()}}
});
test('background and ambiguous task gates are rejected before saving',async()=>{
 for(const tasks of [[{name:'Check',isBackground:true}],[{name:'Check'},{name:'Check'}]]){
 const h=host({tasks});try{let saves=0;h.vscode.workspace.saveAll=async()=>{saves++;return true};const {runWorkflow}=require('../out/commands/workflows');const {Services}=require('../out/services');const s=new Services();await assert.rejects(runWorkflow({name:'Check',steps:[{save:'all'},{task:'Check'}]},{},s));assert.equal(saves,0);s.dispose();}finally{h.restore()}}
});
