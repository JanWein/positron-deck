import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const actions=read('catalog/actions.json');
const manifest=read('extension/package.json');
manifest.version='0.2.0';manifest.repository={type:'git',url:'https://github.com/JanWein/positron-deck.git',directory:'extension'};
manifest.homepage='https://janwein.github.io/positron-deck/';manifest.bugs={url:'https://github.com/JanWein/positron-deck/issues'};
manifest.scripts.package='vsce package --no-rewrite-relative-links --out positron-deck-0.2.0.vsix';
manifest.contributes.commands=actions.map(a=>({command:a.command,title:a.name,category:'Positron Deck'}));
manifest.contributes.keybindings=actions.map(a=>({command:a.command,key:a.shortcut,mac:a.shortcut,when:a.when}));
write('extension/package.json',manifest);
const ts=read('extension/tsconfig.json');ts.compilerOptions.resolveJsonModule=true;write('extension/tsconfig.json',ts);
write('extension/src/catalog.json',actions);write('streamdeck/src/actions.json',actions);write('docs/actions.json',actions);
write('streamdeck/assets/extension-manifest.json',manifest);
const fallback=actions.map(a=>({command:a.command,key:a.fallback,mac:a.fallback,when:a.when}));
write('streamdeck/assets/keybindings-fallback.json',fallback);write('extension/docs/keybindings-fallback.json',fallback);write('docs/keybindings-fallback.json',fallback);
for(const dir of ['extension','streamdeck']){const lock=read(`${dir}/package-lock.json`);lock.version='0.2.0';lock.packages[''].version='0.2.0';write(`${dir}/package-lock.json`,lock);}
const sp=read('streamdeck/package.json');sp.version='0.2.0';write('streamdeck/package.json',sp);
const header='# Action reference\n\nGenerated from `catalog/actions.json`. Host availability is checked at execution time. Positron actions may depend on the installed version or optional views.\n\n';
const groups=[...new Set(actions.map(a=>a.group))];
let md=header;
for(const group of groups){md+=`## ${group}\n\n| Action | Command / hotkey | Behavior and requirement |\n|---|---|---|\n`;for(const a of actions.filter(a=>a.group===group))md+=`| ${a.name} | \`${a.command}\`<br>\`${a.shortcut}\` | ${a.description} **Host:** ${a.host}. ${a.targets.length?'Native: '+a.targets.map(t=>'`'+t+'`').join(', ')+'.':''} ${a.confirm?'Confirmation required.':''} |\n`;md+='\n';}
fs.writeFileSync('docs/COMMANDS.md',md);fs.writeFileSync('extension/docs/KEYBINDINGS.md',header+actions.map(a=>`- **${a.name}**: \`${a.shortcut}\` → \`${a.command}\``).join('\n')+'\n');
console.log(`Generated ${actions.length} synchronized actions.`);

await import('./icons.mjs');
write('docs/settings.json',manifest.contributes.configuration.properties);
