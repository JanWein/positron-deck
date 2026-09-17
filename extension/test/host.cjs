const {EventEmitter: Emitter} = require('node:events');
const Module = require('node:module');
function host(options = {}) {
  const registered = new Map(), calls=[], messages=[], taskRuns=[], config={...options.config};
  const uri = path => ({fsPath:path,path,scheme:'file',toString:()=>`file://${path}`});
  const folder={name:'fixture',index:0,uri:uri('/fixture')};
  let selection={isEmpty:false,active:{line:0}};
  const document={languageId:'python',uri:uri('/fixture/app.py'),isDirty:false,isUntitled:false,getText:()=> 'print(42)',lineAt:()=>({text:'print(7)'}),save:async()=>true};
  const data=options.files ?? {'pyproject.toml':'[project]\nname="demo"'};
  const available=new Set(options.available ?? ['workbench.action.terminal.focus','git.push']);
  const emitter = () => { const e=new Emitter();return {event:cb=>{e.on('e',cb);return {dispose:()=>e.off('e',cb)}},fire:x=>e.emit('e',x),dispose:()=>e.removeAllListeners()}; };
  const taskEnd=emitter();
  const vscode={
    EventEmitter:class {constructor(){Object.assign(this,emitter())}},
    Uri:{file:uri,joinPath:(base,...parts)=>uri([base.fsPath,...parts].join('/'))},
    TestRunProfileKind:{Run:1},TaskRevealKind:{Always:1},TaskPanelKind:{Dedicated:2},TaskScope:{Workspace:2},
    ProcessExecution:class {constructor(process,args,options){Object.assign(this,{process,args,options})}},
    ShellExecution:class {constructor(commandLine,options){Object.assign(this,{commandLine,options})}},
    Task:class {constructor(definition,scope,name,source,execution){Object.assign(this,{definition,scope,name,source,execution})}},
    commands:{registerCommand:(id,fn)=>{registered.set(id,fn);return {dispose:()=>registered.delete(id)}},getCommands:async()=>[...available,...registered.keys()],executeCommand:async(id,...args)=>{calls.push({id,args});if(registered.has(id))return registered.get(id)(...args);return options.results?.[id];}},
    extensions:{getExtension: id=>options.extensions?.[id]},
    workspace:{isTrusted:options.trusted ?? true,workspaceFolders:[folder],getWorkspaceFolder:()=>folder,getConfiguration:()=>({get:(key,fallback)=>config[key] ?? fallback}),saveAll:async()=>true,
      fs:{readDirectory:async()=>Object.keys(data).map(n=>[n,1]),stat:async u=>{const value=data[u.fsPath.split('/').pop()];if(value===undefined){const e=new Error('missing');e.code='FileNotFound';throw e;}return {size:Buffer.byteLength(value),type:1}},readFile:async u=>Buffer.from(data[u.fsPath.split('/').pop()] ?? '')}},
    window:{activeTextEditor:{document,selection},createOutputChannel:()=>({appendLine:line=>calls.push({log:line}),dispose(){},show(){}}),setStatusBarMessage:()=>({dispose(){}}),showErrorMessage:async m=>{messages.push(m)},showInformationMessage:async m=>{messages.push(m)},showWarningMessage:async()=>options.confirm,showQuickPick:async list=>options.pick===undefined ? list[0] : options.pick,showWorkspaceFolderPick:async()=>folder},
    tasks:{onDidEndTask:taskEnd.event,onDidEndTaskProcess:()=>({dispose(){}}),executeTask:async task=>{const result={task,terminate(){result.terminated=true}};taskRuns.push(result);return result;},fetchTasks:async()=>options.tasks ?? []}
  };
  const original=Module._load;
  Module._load=function(name,...args){if(name==='vscode')return vscode;if(name==='positron'){if(options.positron)return options.positron;throw new Error('not Positron')}return original.call(this,name,...args)};
  // Reload source modules so each test owns its VS Code facade.
  for(const key of Object.keys(require.cache)) if(key.includes('/out/')) delete require.cache[key];
  const context={subscriptions:[]};
  return {vscode,context,registered,calls,messages,taskRuns,config,folder,document,uri,taskEnd,restore:()=>{context.subscriptions.forEach(d=>d.dispose());Module._load=original;}};
}
module.exports={host};
