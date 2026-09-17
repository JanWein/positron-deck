const assert=require('node:assert/strict');
const vscode=require('vscode');
exports.run=async()=>{
 const extension=vscode.extensions.getExtension('positron-deck.positron-deck');assert.ok(extension,'extension discovered');await extension.activate();
 const commands=await vscode.commands.getCommands(true);
 for(const entry of require('../../package.json').contributes.commands)assert.ok(commands.includes(entry.command),entry.command+' registered');
 await vscode.commands.executeCommand('positronDeck.openProblems');
 await vscode.commands.executeCommand('positronDeck.openSourceControl');
 await vscode.commands.executeCommand('positronDeck.showLog');
 const events=extension.exports.getState();assert.ok(events.some(x=>x.command==='positronDeck.openProblems'&&x.phase==='dispatched'));
 console.log('Extension host smoke test passed: all commands registered, navigation dispatched.');
};
