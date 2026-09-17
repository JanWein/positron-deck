import fs from 'node:fs';import assert from 'node:assert/strict';
const a=JSON.parse(fs.readFileSync('catalog/actions.json'));const pages=JSON.parse(fs.readFileSync('docs/xl-layouts.json'));assert.equal(pages.length,8);
for(const p of pages){assert.equal(p.actions.length,24,p.name);for(const id of p.actions)assert.ok(a.some(x=>x.id===id),id);}
for(const item of a)assert.ok(fs.existsSync(`docs/icons/${item.id}.svg`),item.id);
const html=fs.readFileSync('docs/index.html','utf8');for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){const path=match[1];if(!path.includes(':'))assert.ok(fs.existsSync(`docs/${path}`),path);}
assert.deepEqual(a,JSON.parse(fs.readFileSync('streamdeck/src/actions.json')));assert.deepEqual(a,JSON.parse(fs.readFileSync('extension/src/catalog.json')));
console.log(`Documentation checked: ${a.length} actions, 8 XL pages, local links and icons.`);
