import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
const dir='org.positron-deck.shortcuts.sdPlugin';
await fs.mkdir(`${dir}/bin`,{recursive:true});
await build({entryPoints:['src/plugin.ts'],outfile:`${dir}/bin/plugin.js`,bundle:true,platform:'node',format:'esm',target:'node24',external:['koffi'],banner:{js:"import {createRequire as __createRequire} from 'node:module'; const require = __createRequire(import.meta.url);"}});
await fs.writeFile(`${dir}/package.json`,JSON.stringify({type:'module',private:true}));
// Ship the actual prebuilt Windows native modules. No compiler or download at runtime.
const koffiDir=`${dir}/node_modules/koffi`;
await fs.mkdir(koffiDir,{recursive:true});
for(const file of ['index.js','package.json','LICENSE.txt']) await fs.copyFile(`node_modules/koffi/${file}`,`${koffiDir}/${file}`);
for(const arch of ['win32_x64','win32_arm64']) {
  const dest=path.join(koffiDir,'build/koffi',arch);await fs.mkdir(dest,{recursive:true});
  await fs.copyFile(`node_modules/koffi/build/koffi/${arch}/koffi.node`,`${dest}/koffi.node`);
}
const actions=JSON.parse(await fs.readFile('src/actions.json','utf8'));
const manifest={
 $schema:'https://schemas.elgato.com/streamdeck/plugins/manifest.json',UUID:'org.positron-deck.shortcuts',Name:'Positron Deck',Category:'Positron Deck',CategoryIcon:'imgs/category',Author:'Jan-Hendrik Weinert',Description:'Ready-to-drag hotkey actions for Positron Deck. Windows only; no direct connection to the IDE.',Version:'0.2.0.0',SDKVersion:2,Software:{MinimumVersion:'7.1'},OS:[{Platform:'windows',MinimumVersion:'10'}],Nodejs:{Version:'24'},CodePath:'bin/plugin.js',Icon:'imgs/plugin',PropertyInspectorPath:'ui/inspector.html',
 Actions:actions.map(p=>({UUID:p.uuid,Name:p.name,Tooltip:`${p.command}: ${p.shortcut}`,Icon:`imgs/${p.id}-list`,Controllers:['Keypad'],SupportedInMultiActions:true,States:[{Image:`imgs/${p.id}-key`,Title:p.title,TitleAlignment:'bottom',FontSize:11}]}))
};
await fs.writeFile(`${dir}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
await fs.copyFile('src/actions.json',`${dir}/ui/actions.json`);
await fs.copyFile('assets/keybindings-fallback.json',`${dir}/keybindings-fallback.json`);
// Existing extension is a separate installation, never executed by the plugin.
for(const name of ['README.md','LICENSE','THIRD-PARTY-NOTICES.txt','TESTING.md'])await fs.copyFile(name,`${dir}/${name}`);
await fs.mkdir('.test-build',{recursive:true});
for(const name of ['shortcuts','engine','windows'])await build({entryPoints:[`src/${name}.ts`],outfile:`.test-build/${name}.mjs`,bundle:true,platform:'node',format:'esm',target:'node24',external:['koffi']});
