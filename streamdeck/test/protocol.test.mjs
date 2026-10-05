import test from 'node:test';import assert from 'node:assert/strict';import {WebSocketServer} from 'ws';import {spawn} from 'node:child_process';import path from 'node:path';
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
    else if(message.event==='setImage') {sawImage=true;assert.equal(message.payload.image,'imgs/gitPush-key.svg');}
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
