import test from 'node:test';import assert from 'node:assert/strict';import {WebSocketServer} from 'ws';import {spawn} from 'node:child_process';import path from 'node:path';
function decodedImage(message) {
 assert.match(message.payload.image,/^data:image\/svg\+xml;base64,[A-Za-z0-9+/]+=*$/);
 assert.equal(message.payload.target,0);
 const svg=Buffer.from(message.payload.image.split(',')[1],'base64').toString('utf8');
 assert.match(svg,/<svg\b/);assert.match(svg,/xmlns="http:\/\/www.w3.org\/2000\/svg"/);
 return svg;
}
test('built plugin connects to Elgato protocol and handles a button event on a non-Windows test host',{skip:process.platform==='win32',timeout:10000},async()=>{
 const server=new WebSocketServer({port:0,host:'127.0.0.1'});
 await new Promise(r=>server.once('listening',r));const port=server.address().port;
 const info={application:{font:'Arial',language:'de',platform:'windows',platformVersion:'10',version:'7.1'},colors:{},devicePixelRatio:1,devices:[{id:'test-xl',name:'Stream Deck XL',size:{columns:8,rows:4},type:2}],plugin:{uuid:'org.positron-deck.shortcuts',version:'0.1.0.0'}};
 const child=spawn(process.execPath,['bin/plugin.js','-port',String(port),'-pluginUUID','test-registration','-registerEvent','registerPlugin','-info',JSON.stringify(info)],{cwd:path.resolve('org.positron-deck.shortcuts.sdPlugin'),stdio:['ignore','pipe','pipe']});
 let sawTitle=false,sawImage=false,legacyChecked=false;
 let output='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);
 try {
  await new Promise((resolve,reject)=>{
   child.once('exit',code=>reject(new Error('Plugin exited '+code+': '+output)));
   server.once('connection',socket=>socket.on('message',raw=>{
    const message=JSON.parse(raw);
    if(message.event==='registerPlugin'){
     assert.equal(message.uuid,'test-registration');
     const event={action:'org.positron-deck.shortcuts.runselection',context:'test-key',device:'test-xl',payload:{controller:'Keypad',coordinates:{column:0,row:1},settings:{},isInMultiAction:false,state:0}};
     socket.send(JSON.stringify({...event,event:'willAppear'}));socket.send(JSON.stringify({...event,event:'keyDown'}));
    }else if(message.event==='setTitle') {sawTitle=true;assert.equal(message.payload.title,'Push');}
    else if(message.event==='setImage') {sawImage=true;assert.ok(decodedImage(message).includes('<title>Git: Push</title>'));assert.ok(decodedImage(message).includes('M36 48V12'));}
    else if(message.event==='showAlert') {
     if(!legacyChecked){
      assert.equal(message.context,'test-key');legacyChecked=true;
      const grouped={action:'org.positron-deck.shortcuts.group-git',context:'grouped-key',device:'test-xl',payload:{controller:'Keypad',coordinates:{column:1,row:1},settings:{command:'positronDeck.gitPush'},isInMultiAction:false,state:0}};
      socket.send(JSON.stringify({...grouped,event:'willAppear'}));
      setTimeout(()=>socket.send(JSON.stringify({...grouped,event:'keyDown'})),30);
     }else {assert.equal(message.context,'grouped-key');assert.ok(sawTitle);assert.ok(sawImage);resolve();}
    }
   }));
  });
 }finally{child.kill();for(const client of server.clients)client.terminate();await new Promise(r=>server.close(r));}
});

test('function changes update the actual button title and icon through the SDK',{skip:process.platform==='win32',timeout:10000},async()=>{
 const server=new WebSocketServer({port:0,host:'127.0.0.1'});
 await new Promise(r=>server.once('listening',r));
 const info={application:{font:'Arial',language:'en',platform:'windows',platformVersion:'10',version:'7.1'},colors:{},devicePixelRatio:1,devices:[{id:'xl',name:'XL',size:{columns:8,rows:4},type:2}],plugin:{uuid:'org.positron-deck.shortcuts',version:'0.3.1.0'}};
 const child=spawn(process.execPath,['bin/plugin.js','-port',String(server.address().port),'-pluginUUID','registration','-registerEvent','registerPlugin','-info',JSON.stringify(info)],{cwd:path.resolve('org.positron-deck.shortcuts.sdPlugin'),stdio:'ignore'});
 try{
  await new Promise((resolve,reject)=>{
   child.once('exit',code=>reject(new Error('Plugin exited '+code)));
   server.once('connection',socket=>{
    const event={action:'org.positron-deck.shortcuts.group-code',context:'code-key',device:'xl',payload:{controller:'Keypad',coordinates:{column:0,row:0},settings:{command:'positronDeck.runSelection'},isInMultiAction:false,state:0}};
    let changed=false,sawTitle=false;
    socket.on('message',raw=>{try{
     const message=JSON.parse(raw);
     if(message.event==='registerPlugin')socket.send(JSON.stringify({...event,event:'willAppear'}));
     if(message.event==='setTitle'){
      assert.equal(message.payload.title,changed?'Run File':'Run\nSelection');sawTitle=true;
     }
     if(message.event==='setImage'){
      assert.ok(sawTitle);assert.equal(message.context,'code-key');
      assert.ok(decodedImage(message).includes(changed?'<title>Run File</title>':'<title>Run Selection or Line</title>'));
      assert.ok(decodedImage(message).includes(changed?'M19 47V10':'stroke-dasharray'));
      if(changed){resolve();return;}
      changed=true;sawTitle=false;
      socket.send(JSON.stringify({...event,event:'didReceiveSettings',payload:{...event.payload,settings:{command:'positronDeck.runFile'}}}));
     }
    }catch(error){reject(error)}});
   });
  });
 }finally{child.kill();for(const client of server.clients)client.terminate();await new Promise(r=>server.close(r));}
});
