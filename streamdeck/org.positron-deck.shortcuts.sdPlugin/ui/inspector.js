/* Only the Stream Deck application's local property-inspector connection is used. */
let socket,context,manifestId,preset,group,actions=[],settings={};
const element=id=>document.getElementById(id);
function choices(){
 const members=group?actions.filter(a=>group.commands.includes(a.command)):[];
 if(group?.id!=='language')return members;
 const language=settings.language||'auto';
 return members.filter(a=>language==='auto'||language==='r'||a.group!=='r');
}
function render(){
 if(!preset)return;
 element('selectionGroup').hidden=!group;
 element('languageGroup').hidden=group?.id!=='language';
 element('language').value=settings.language||'auto';
 const options=choices();
 element('operation').replaceChildren(...options.map(a=>{const o=document.createElement('option');o.value=a.command;o.textContent=a.name;return o}));
 element('operation').value=preset.command;
 const mode=settings.mode||'default';
 element('description').textContent=preset.description||'';element('name').textContent=group?.name||preset.name;element('command').textContent=preset.command;
 element('mode').value=mode;element('shortcut').value=settings.shortcut||'';element('delay').value=String(settings.delay??120);
 element('customGroup').hidden=mode!=='custom';
 element('delayGroup').hidden=mode!=='fallback'&&!(mode==='default'?preset.shortcut:settings.shortcut||'').includes(' ');
 element('effective').textContent=mode==='custom'?(settings.shortcut||'Choose a shortcut'):mode==='fallback'?preset.fallback:preset.shortcut;
}
function save(){
 if(!socket||socket.readyState!==WebSocket.OPEN||!preset)return;
 const delay=Number(element('delay').value);
 settings={...settings,mode:element('mode').value,shortcut:element('shortcut').value.trim(),delay:Number.isFinite(delay)?Math.max(50,Math.min(1000,delay)):120};
 if(group)settings.command=preset.command;
 if(group?.id==='language')settings.language=element('language').value;
 if(settings.mode==='custom'&&!settings.shortcut){element('state').textContent='Enter a custom shortcut.';return;}
 socket.send(JSON.stringify({event:'setSettings',action:manifestId,context,payload:settings}));
 element('state').textContent='Settings updated.';render();
}
window.connectElgatoStreamDeckSocket=async function(port,uuid,registerEvent,info,actionInfo){
 const action=JSON.parse(actionInfo);context=action.context;manifestId=action.action;settings=action.payload.settings||{};
 try{
  actions=await(await fetch('actions.json')).json();
  const groups=await(await fetch('groups.json')).json();
  group=groups.find(g=>g.uuid===manifestId);
  const resolve=()=>group?actions.find(a=>a.command===(settings.command||group.defaultCommand)&&group.commands.includes(a.command)):actions.find(a=>a.uuid===manifestId);
  preset=resolve();if(!preset)throw new Error('unknown');
  render();socket=new WebSocket(`ws://127.0.0.1:${port}`);
  socket.onopen=()=>{socket.send(JSON.stringify({event:registerEvent,uuid}));socket.send(JSON.stringify({event:'getSettings',action:manifestId,context}));};
  socket.onmessage=event=>{let message;try{message=JSON.parse(event.data)}catch{return}if(message.event==='didReceiveSettings'&&message.context===context){settings=message.payload.settings||{};preset=resolve();if(preset)render();else element('state').textContent='Unknown function. Choose a function again.';}};
  socket.onerror=()=>{element('state').textContent='Stream Deck connection unavailable.'};
 }catch{element('state').textContent='Could not load action settings.'}
};
for(const id of ['mode','shortcut','delay'])element(id).addEventListener('change',save);
element('operation').addEventListener('change',()=>{
 preset=actions.find(a=>a.command===element('operation').value&&group?.commands.includes(a.command));
 if(!preset)return;
 // A custom shortcut belongs to its function. Reset when selecting a different function.
 settings={...settings,mode:'default',shortcut:''};render();save();
});
element('language').addEventListener('change',()=>{
 settings.language=element('language').value;
 if(!choices().some(a=>a.command===preset.command))preset=choices()[0];
 settings={...settings,mode:'default',shortcut:''};render();save();
});
element('reset').addEventListener('click',()=>{element('mode').value='default';element('shortcut').value='';element('delay').value='120';save()});
