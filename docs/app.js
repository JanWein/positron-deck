'use strict';
const el=id=>document.getElementById(id);let actions=[],pages=[],category='all';
const names={all:'All actions',code:'Code & cells',navigation:'Navigation',editor:'Editor',data:'Data & plots',git:'Git',layout:'Layouts',terminal:'Terminal',debug:'Debug',notebook:'Notebooks',workflow:'Workflows',r:'R packages',app:'Apps & Quarto',deploy:'Deploy'};
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function details(a){
 const out=el('detail-content');out.replaceChildren();const img=node('img');img.src=`icons/${a.id}.svg`;img.alt='';out.append(img,node('p',`${names[a.group]} · ${a.host}`,'eyebrow'),node('h2',a.name),node('p',a.description),node('h3','Deck command'),node('code',a.command),node('h3','Default shortcut'),node('code',a.shortcut));
 const copy=node('button','Copy shortcut','copy');copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(a.shortcut);copy.textContent='Copied';}catch{copy.textContent='Select the shortcut above to copy';}});out.append(copy);
 if(a.targets.length)out.append(node('h3','Native command'),node('code',a.targets.join('\n')));
 out.append(node('p',a.trusted?'Requires a trusted workspace.':'Available in restricted workspaces.'));
 if(a.confirm)out.append(node('p',`Confirmation: ${a.confirm}`));
 if(a.host==='Positron')out.append(node('p','Requires the relevant Positron feature and active view. Newer features may be absent in older releases. Run Check Action Availability to inspect your host.'));
 if(!el('detail').open)el('detail').showModal();
}
function renderCards(){
 const q=el('search').value.trim().toLowerCase();const host=el('host').value;
 const matches=actions.filter(a=>(category==='all'||a.group===category)&&(!host||a.host===host)&&`${a.name} ${a.command} ${a.description} ${a.group} ${a.targets.join(' ')}`.toLowerCase().includes(q));
 el('result-count').textContent=`${matches.length} of ${actions.length} actions · select a card for the exact mapping`;
 const cards=el('cards');cards.replaceChildren();
 for(const a of matches){const card=node('button',undefined,'card');card.type='button';const img=node('img');img.src=`icons/${a.id}.svg`;img.alt='';img.loading='lazy';card.append(img,node('h3',a.name),node('p',a.description),node('span',`${names[a.group]} · ${a.host}`,'badge'));card.addEventListener('click',()=>details(a));cards.append(card);}
 if(!matches.length)cards.append(node('p','No matching actions. Try another search or reset the category.'));
}
function renderDeck(index=0){
 const deck=el('deck');deck.replaceChildren();pages.forEach((p,i)=>{const b=node('button',p.name,'page-key'+(index===i?' active':''));b.setAttribute('aria-pressed',String(index===i));b.addEventListener('click',()=>renderDeck(i));deck.append(b);});
 for(const id of pages[index].actions){const a=actions.find(a=>a.id===id);const b=node('button');b.title=a.name;const img=node('img');img.src=`icons/${id}.svg`;img.alt='';b.append(img,node('span',a.name.replace('Notebook: ','').replace('Git: ','').replace('R Package: ','')));b.addEventListener('click',()=>details(a));deck.append(b);}
}
async function init(){
 try{
 const responses=await Promise.all(['actions.json','xl-layouts.json','settings.json'].map(url=>fetch(url)));if(responses.some(r=>!r.ok))throw new Error('load');
 const data=await Promise.all(responses.map(r=>r.json()));[actions,pages]=data;
 document.querySelectorAll('.count').forEach(n=>n.textContent=String(actions.length));
 for(const id of ['all',...new Set(actions.map(a=>a.group))]){const b=node('button',names[id]||id,'chip'+(id==='all'?' active':''));b.setAttribute('aria-pressed',String(id==='all'));b.addEventListener('click',()=>{category=id;el('categories').querySelectorAll('button').forEach(n=>{n.classList.toggle('active',n===b);n.setAttribute('aria-pressed',String(n===b));});renderCards();});el('categories').append(b);}
 for(const [id,setting] of Object.entries(data[2])){const tr=node('tr');const first=node('td');first.append(node('code',id));tr.append(first,node('td',JSON.stringify(setting.default)),node('td',setting.description));el('settings-table').append(tr);}
 renderCards();renderDeck();
 }catch{el('result-count').textContent='Could not load the action catalog. Use the Markdown reference below or serve this folder over HTTP.';}
}
el('search').addEventListener('input',renderCards);el('host').addEventListener('change',renderCards);el('close-detail').addEventListener('click',()=>el('detail').close());el('detail').addEventListener('click',e=>{if(e.target===el('detail'))el('detail').close();});void init();
