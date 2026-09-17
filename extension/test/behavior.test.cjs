const test=require('node:test');const assert=require('node:assert/strict');const {host}=require('./host.cjs');
async function withHost(options,fn){const h=host(options);try{h.api=require('../out/extension').activate(h.context);await fn(h)}finally{h.restore()}}
const run=(h,id)=>h.vscode.commands.executeCommand('positronDeck.'+id);
function runtime(language='python',state='idle') {const calls=[];return {calls,runtime:{getForegroundSession:async()=>({metadata:{sessionId:'active'},runtimeMetadata:{languageId:language,runtimePath:'/env/bin/'+language},getRuntimeState:()=>state}),executeCode:async(...a)=>{calls.push(a);return {}},restartSession:async()=>{calls.push('restart');return true},interruptSession:async()=>{calls.push('interrupt')}}}}
test('all catalog contributed commands are registered; all bindings and layout targets resolve',()=>withHost({},async h=>{
 const manifest=require('../package.json');const ids=manifest.contributes.commands.map(c=>c.command);
 assert.equal(ids.length,require("../src/catalog.json").length);assert.deepEqual([...h.registered.keys()].sort(),[...ids].sort());
 const keys=manifest.contributes.keybindings.map(b=>b.key);assert.equal(new Set(keys).size,keys.length);
 for(const b of manifest.contributes.keybindings){assert.ok(ids.includes(b.command));assert.match(b.key,/(?:f(1[3-9]|2[0-4])|f[1-5] [a-z0-9])$/);assert.ok(!b.when.includes('!inputFocus'))}
 const layout=require('../streamdeck/layout.json');assert.equal(layout.rows.length,3);for(const row of layout.rows){assert.equal(row.length,8);for(const b of row)assert.ok(ids.includes(b.command))}
}));
test('empty selection uses the current line and targets active session',()=>{const api=runtime();return withHost({positron:api},async h=>{
 h.vscode.window.activeTextEditor.selection.isEmpty=true;await run(h,'runSelection');
 assert.deepEqual(h.messages,[]);assert.equal(api.calls[0][1],'print(7)');assert.equal(api.calls[0][7],'active');
})});
test('different runtime language and busy runtime reject execution',async()=>{
 for(const api of [runtime('r'),runtime('python','busy')])await withHost({positron:api},async h=>{await run(h,'runSelection');assert.equal(api.calls.length,0);assert.equal(h.messages.length,1)});
});
test('missing optional Positron API does not break VS Code navigation or R extension delegation',()=>withHost({available:['workbench.view.scm','r.runSelection']},async h=>{
 h.document.languageId='r';await run(h,'runSelection');await run(h,'openSourceControl');
 assert.ok(h.calls.some(c=>c.id==='r.runSelection'));assert.ok(h.calls.some(c=>c.id==='workbench.view.scm'));assert.deepEqual(h.messages,[]);
}));
test('restart cancellation preserves runtime; interruption targets the runtime API',async()=>{
 const api=runtime();await withHost({positron:api},async h=>{await run(h,'restartRuntime');assert.equal(api.calls.length,0);await run(h,'stopExecution');assert.deepEqual(api.calls,['interrupt']);assert.ok(h.api.getState().some(e=>e.phase==='cancelled'))});
});
test('confirmed restart invokes runtime API',async()=>{const api=runtime();await withHost({positron:api,confirm:'Restart'},async h=>{await run(h,'restartRuntime');assert.deepEqual(api.calls,['restart'])})});
test('native test profiles take precedence over pytest without duplicate fallback',()=>withHost({available:['testing.getSelectedProfiles','testing.runAll'],results:{'testing.getSelectedProfiles':[{kind:1,controllerId:'python'}]}},async h=>{
 await run(h,'test');assert.ok(h.calls.some(c=>c.id==='testing.runAll'));assert.equal(h.taskRuns.length,0);
}));
test('native testCurrentFile dispatches current-file command',()=>withHost({available:['testing.getSelectedProfiles','testing.runCurrentFile'],results:{'testing.getSelectedProfiles':[{kind:1}]}},async h=>{
 await run(h,'testCurrentFile');assert.ok(h.calls.some(c=>c.id==='testing.runCurrentFile'));assert.equal(h.taskRuns.length,0);
}));
test('R test file filter is anchored and regexp escaped',()=>withHost({files:{DESCRIPTION:'Package: example'},available:['r.runCommand']},async h=>{
 h.document.languageId='r';h.document.uri=h.uri('/fixture/tests/testthat/test-a.b.R');await run(h,'testCurrentFile');
 const code=h.calls.find(c=>c.id==='r.runCommand').args[0];assert.match(code,/requireNamespace\("devtools"/);assert.ok(code.includes('filter="^a\\\\.b$"'));assert.deepEqual(h.messages,[]);
}));
test('R current-file testing rejects source files instead of running the full suite',()=>withHost({files:{DESCRIPTION:'Package: example'},available:['r.runCommand']},async h=>{
 h.document.languageId='r';h.document.uri=h.uri('/fixture/R/a.R');await run(h,'testCurrentFile');assert.equal(h.taskRuns.length,0);assert.match(h.messages[0],/testthat/);
}));
test('R load_all cannot silently run in a throwaway process',()=>withHost({files:{DESCRIPTION:'Package: example'}},async h=>{
 await run(h,'rLoadAll');assert.equal(h.taskRuns.length,0);assert.match(h.messages[0],/interactive session/);
}));
test('package styling is cancelled before any file-changing action',()=>withHost({files:{DESCRIPTION:'Package: example'},available:['r.runCommand']},async h=>{
 await run(h,'rStyle');assert.ok(!h.calls.some(c=>c.id==='r.runCommand'));assert.equal(h.taskRuns.length,0);
}));
test('Quarto preview uses document render, never diagram preview shortcut',()=>withHost({files:{'_quarto.yml':''},available:['quarto.render','quarto.previewShortcut']},async h=>{
 h.document.uri=h.uri('/fixture/report.qmd');h.document.languageId='quarto';await run(h,'preview');assert.ok(h.calls.some(c=>c.id==='quarto.render'));assert.ok(!h.calls.some(c=>c.id==='quarto.previewShortcut'));assert.equal(h.taskRuns.length,0);
}));
test('Quarto fallback uses exact file argument without shell interpolation',()=>withHost({files:{'_quarto.yml':''}},async h=>{
 h.document.uri=h.uri('/fixture/report; $(echo secret).qmd');await run(h,'render');assert.deepEqual(h.taskRuns[0].task.execution.args,['render','/fixture/report; $(echo secret).qmd']);
}));
test('app starts in project runtime environment and only its own task is stopped',()=>withHost({files:{'app.py':'import streamlit as st'},config:{'python.executable':'/venv with spaces/python'},confirm:'Stop'},async h=>{
 await run(h,'runApp');const task=h.taskRuns[0];assert.equal(task.task.execution.process,'/venv with spaces/python');assert.deepEqual(task.task.execution.args,['-m','streamlit','run','app.py','--server.headless=true']);
 await run(h,'runApp');assert.equal(h.taskRuns.length,1);assert.match(h.messages[0],/already running/);
 await run(h,'stopApp');assert.equal(task.terminated,true);h.taskEnd.fire({execution:task});await run(h,'runApp');assert.equal(h.taskRuns.length,2);
}));
test('FastAPI detects an explicitly named ASGI object',()=>withHost({files:{'main.py':'from fastapi import FastAPI\napi = FastAPI()'}},async h=>{
 await run(h,'runApp');assert.deepEqual(h.taskRuns[0].task.execution.args,['-m','uvicorn','main:api']);
}));
test('multiple app candidates require a selection and cancellation starts nothing',()=>withHost({files:{'app.py':'from shiny import App\nimport streamlit'},pick:null},async h=>{
 await run(h,'runApp');assert.equal(h.taskRuns.length,0);assert.ok(h.api.getState().some(e=>e.phase==='cancelled'));
}));
test('unconfigured deployment performs no writes',()=>withHost({},async h=>{
 await run(h,'deploy');assert.equal(h.taskRuns.length,0);assert.match(h.messages[0],/Choose a deployment provider/);
}));
test('custom deployment requires confirmation even if confirmDeploy is false and does not log command',()=>withHost({config:{'deploy.provider':'custom','deploy.command':'deploy --token TOP_SECRET','confirmDeploy':false}},async h=>{
 await run(h,'deploy');assert.equal(h.taskRuns.length,0);assert.ok(!JSON.stringify(h.calls).includes('TOP_SECRET'));
}));
test('confirmed custom deployment uses a tracked shell task',()=>withHost({config:{'deploy.provider':'custom','deploy.command':'./scripts/deploy.sh'},confirm:'Deploy'},async h=>{
 await run(h,'deploy');assert.equal(h.taskRuns[0].task.execution.commandLine,'./scripts/deploy.sh');await run(h,'deploy');assert.equal(h.taskRuns.length,1);
}));
test('Git deployment routes selected project URI to built-in Git',()=>withHost({files:{'.git':''},config:{'deploy.provider':'git'},confirm:'Deploy'},async h=>{
 await run(h,'deploy');assert.equal(h.calls.find(c=>c.id==='git.push').args[0].fsPath,'/fixture');
}));
test('Publisher receives active entrypoint URI and manages its own workflow',()=>withHost({available:['posit.publisher.deployWithEntrypoint'],config:{'deploy.provider':'positPublisher'},confirm:'Deploy'},async h=>{
 await run(h,'deploy');assert.equal(h.calls.find(c=>c.id==='posit.publisher.deployWithEntrypoint').args[0].fsPath,'/fixture/app.py');
}));
test('task deployment selects by label and workspace scope',()=>withHost({config:{'deploy.provider':'task','deploy.task':'Ship'},confirm:'Deploy'},async h=>{
 const other={name:'Ship',scope:{uri:h.uri('/other')}};const correct={name:'Ship',scope:h.folder,definition:{type:'shell'}};h.vscode.tasks.fetchTasks=async()=>[other,correct];
 await run(h,'deploy');assert.equal(h.taskRuns[0].task,correct);
}));
test('unknown third-party errors never leak secrets into messages or logs',()=>withHost({},async h=>{
 const original=h.vscode.commands.executeCommand;h.vscode.commands.executeCommand=async(id,...args)=>{if(id==='git.push')throw new Error('https://u:PASSWORD@server/?token=SECRET');return original(id,...args)};
 await run(h,'gitPush');assert.match(h.messages[0],/Could not complete/);assert.ok(!JSON.stringify([h.messages,h.calls]).includes('PASSWORD'));assert.ok(!JSON.stringify([h.messages,h.calls]).includes('SECRET'));
}));
