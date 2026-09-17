const test=require('node:test');
const assert=require('node:assert/strict');
const {host}=require('./host.cjs');
test('vertical slice registers and dispatches via the same commands used by the palette',async()=>{
 const code=[];
 const h=host({positron:{runtime:{getForegroundSession:async()=>({metadata:{sessionId:'session'},runtimeMetadata:{languageId:'python',runtimePath:'/python'}}),executeCode:async(...args)=>{code.push(args)}}}});
 try {
  require('../out/extension').activate(h.context);
  for(const id of ['runSelection','openTerminal','gitPush','test'])assert.ok(h.registered.has('positronDeck.'+id));
  await h.vscode.commands.executeCommand('positronDeck.runSelection');
  assert.equal(code[0][1],'print(42)');assert.equal(code[0][7],'session');
  await h.vscode.commands.executeCommand('positronDeck.openTerminal');
  await h.vscode.commands.executeCommand('positronDeck.gitPush');
  await h.vscode.commands.executeCommand('positronDeck.test');
  assert.ok(h.calls.some(c=>c.id==='workbench.action.terminal.focus'));
  assert.ok(h.calls.some(c=>c.id==='git.push'));
  assert.deepEqual(h.taskRuns[0].task.execution.args,['-m','pytest']);
  assert.deepEqual(h.messages,[]);
 } finally {h.restore()}
});
test('untrusted workspaces can navigate but cannot execute project code',async()=>{
 const h=host({trusted:false});try {
  require('../out/extension').activate(h.context);
  await h.vscode.commands.executeCommand('positronDeck.test');
  await h.vscode.commands.executeCommand('positronDeck.openTerminal');
  assert.equal(h.taskRuns.length,0);assert.match(h.messages[0],/Trust/);
  assert.ok(h.calls.some(c=>c.id==='workbench.action.terminal.focus'));
 }finally{h.restore()}
});
