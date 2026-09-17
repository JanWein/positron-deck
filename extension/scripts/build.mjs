import { build } from 'esbuild';
await build({entryPoints:['src/extension.ts'],bundle:true,platform:'node',format:'cjs',target:'node20',external:['vscode','positron'],outfile:'dist/extension.js',sourcemap:true});
