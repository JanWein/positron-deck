export function createGroups(actions){
 const names={code:'Code',navigation:'Navigation',editor:'Editor',data:'Data',layout:'Layout',git:'Git',terminal:'Terminal',debug:'Debug',notebook:'Notebooks',language:'Language Tools',quarto:'Quarto',app:'Apps',deploy:'Deploy',workflow:'Workflows'};
 const languageIds=['runSelection','runFile','test','testCurrentFile','restartRuntime','stopExecution'];
 const groupFor=a=>a.id==='render'||a.id==='preview'||a.id==='quartoWorkspace'?'quarto':a.group==='r'?'language':a.group;
 return Object.entries(names).map(([id,name])=>{
  const members=actions.filter(a=>groupFor(a)===id||(id==='language'&&languageIds.includes(a.id)));
  const first=members[0];
  return {id,name,uuid:`org.positron-deck.shortcuts.group-${id}`,defaultCommand:first.command,iconId:first.id,commands:members.map(a=>a.command)};
 });
}
