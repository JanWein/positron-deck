/* The only socket is the Stream Deck application's own local property-inspector API. */
let socket,context,preset,settings={};
const element=id=>document.getElementById(id);
function render(){
 if(!preset)return;
 const mode=settings.mode||'default';
 element('description').textContent=preset.description||'';element('name').textContent=preset.name;element('command').textContent=preset.command;
 element('mode').value=mode;element('shortcut').value=settings.shortcut||'';element('delay').value=String(settings.delay||120);
 element('customGroup').hidden=mode!=='custom';element('delayGroup').hidden=mode!=='fallback' && !(mode==='default'?preset.shortcut:settings.shortcut||'').includes(' ');
 element('effective').textContent=mode==='custom'?(settings.shortcut||'Noch nicht festgelegt'):mode==='fallback'?preset.fallback:preset.shortcut;
}
function save(){
 if(!socket||socket.readyState!==WebSocket.OPEN||!preset)return;
 const delay=Number(element('delay').value);
 settings={...settings,mode:element('mode').value,shortcut:element('shortcut').value.trim(),delay:Number.isFinite(delay)?Math.max(50,Math.min(1000,delay)):120};
 socket.send(JSON.stringify({event:'setSettings',action:preset.uuid,context,payload:settings}));
 element('state').textContent='Einstellung an Stream Deck übergeben.';render();
}
window.connectElgatoStreamDeckSocket=async function(port,uuid,registerEvent,info,actionInfo){
 const action=JSON.parse(actionInfo);context=action.context;settings=action.payload.settings||{};
 try{
  preset=(await(await fetch('actions.json')).json()).find(p=>p.uuid===action.action);
  if(!preset)throw new Error('unknown');
  render();
  socket=new WebSocket(`ws://127.0.0.1:${port}`);
  socket.onopen=()=>{socket.send(JSON.stringify({event:registerEvent,uuid}));socket.send(JSON.stringify({event:'getSettings',action:preset.uuid,context}));};
  socket.onmessage=event=>{let message;try{message=JSON.parse(event.data)}catch{return}if(message.event==='didReceiveSettings'&&message.context===context){settings=message.payload.settings||{};render();}};
  socket.onerror=()=>{element('state').textContent='Verbindung zu Stream Deck nicht verfügbar.'};
 }catch{element('state').textContent='Aktionsdaten konnten nicht geladen werden.'}
};
for(const id of ['mode','shortcut','delay'])element(id).addEventListener('change',save);
element('reset').addEventListener('click',()=>{element('mode').value='default';element('shortcut').value='';element('delay').value='120';save()});
