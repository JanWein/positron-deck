import fs from 'node:fs';
const actions=JSON.parse(fs.readFileSync('catalog/actions.json','utf8'));
const groups={
 code:['#167268','<path d="m25 18-13 13 13 13m22-26 13 13-13 13m-7-29-8 32"/>'],
 navigation:['#38628f','<path d="M12 19h19l6 6h23v24H12Z"/>'],
 editor:['#5464a0','<path d="m22 46 4-13 23-23 9 9-23 23Zm6-12 9 9M18 53h37"/>'],
 data:['#93652e','<ellipse cx="36" cy="16" rx="22" ry="8"/><path d="M14 16v29c0 11 44 11 44 0V16M14 30c0 11 44 11 44 0"/>'],
 git:['#ae5745','<circle cx="22" cy="15" r="5"/><circle cx="50" cy="15" r="5"/><circle cx="22" cy="48" r="5"/><path d="M22 20v23m0-10h15q13 0 13-13"/>'],
 layout:['#6f5a92','<rect x="12" y="10" width="48" height="42" rx="4"/><path d="M27 10v42M27 33h33M46 10v23"/>'],
 terminal:['#436e78','<rect x="11" y="11" width="50" height="41" rx="4"/><path d="m20 22 10 10-10 10m16 0h15"/>'],
 debug:['#a35570','<rect x="24" y="18" width="24" height="29" rx="11"/><path d="m27 18-6-7m24 7 6-7M13 24h11m24 0h11M12 34h12m24 0h12M17 46l9-6m20 0 9 6M36 19v28"/>'],
 notebook:['#3d768a','<rect x="18" y="8" width="39" height="47" rx="4"/><path d="M26 8v47M12 19h10M12 31h10M12 43h10m22-24 8 7-8 7"/>'],
 workflow:['#a1642d','<rect x="10" y="23" width="14" height="16" rx="3"/><rect x="48" y="23" width="14" height="16" rx="3"/><path d="M24 31h24m-9-8 9 8-9 8"/>'],
 r:['#487c51','<path d="M22 51V12h18c22 0 22 24 0 24H22m17 0 17 15"/>'],
 app:['#7b6931','<rect x="11" y="10" width="50" height="42" rx="4"/><path d="M11 22h50m-31 6 14 9-14 9Z"/>'],
 deploy:['#925075','<path d="M36 44V10m-13 13 13-13 13 13M14 39v14h44V39"/>']
};
fs.mkdirSync('docs/icons',{recursive:true});const dir='streamdeck/org.positron-deck.shortcuts.sdPlugin/imgs';fs.mkdirSync(dir,{recursive:true});
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
for(const [index,a] of actions.entries()){
 const [color,shape]=groups[a.group]||groups.code;
 for(const [kind,size] of [['key',72],['list',20]])for(const [scale,suffix] of [[1,''],[2,'@2x']]){
 const bg=kind==='key'?`<rect width="72" height="72" rx="12" fill="${color}"/><rect x="1" y="1" width="70" height="70" rx="11" fill="none" stroke="#ffffff30"/>`:'';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${size*scale}" height="${size*scale}" viewBox="0 0 72 72"><title>${esc(a.name)}</title>${bg}<g fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 0)">${shape}</g></svg>`;
 fs.writeFileSync(`${dir}/${a.id}-${kind}${suffix}.svg`,svg);
 if(kind==='key'&&scale===1)fs.writeFileSync(`docs/icons/${a.id}.svg`,svg);
 }
}
console.log(`Generated icons for ${actions.length} actions.`);
