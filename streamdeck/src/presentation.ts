// Keep the familiar category colors, with a distinct symbol for common functions
// and a readable function badge for the remaining actions.
const symbols:Record<string,string>={
 runSelection:'<rect x="15" y="14" width="29" height="27" rx="3" stroke-dasharray="4 4"/><path d="m43 29 14 9-14 9Z"/>',
 runFile:'<path d="M19 47V10h23l10 10v10M42 10v12h10m-13 7 17 11-17 11Z"/>',
 stopExecution:'<rect x="23" y="16" width="28" height="28" rx="3"/>',
 restartRuntime:'<path d="M54 28a19 19 0 1 0-3 16M54 12v17H37"/>',
 openExplorer:'<path d="M12 19h19l6 6h23v24H12Z"/>',
 openSearch:'<circle cx="31" cy="26" r="15"/><path d="m42 38 16 16"/>',
 openSourceControl:'<circle cx="22" cy="15" r="5"/><circle cx="50" cy="15" r="5"/><circle cx="22" cy="48" r="5"/><path d="M22 20v23m0-10h15q13 0 13-13"/>',
 openTerminal:'<rect x="11" y="11" width="50" height="41" rx="4"/><path d="m20 22 10 10-10 10m16 0h15"/>',
 openExtensions:'<rect x="12" y="12" width="18" height="18" rx="2"/><rect x="12" y="36" width="18" height="18" rx="2"/><rect x="36" y="36" width="18" height="18" rx="2"/><path d="m45 8 13 13-13 13-13-13Z"/>',
 gitPush:'<path d="M36 48V12m-12 12 12-12 12 12M16 43v10h40V43"/>',
 gitPull:'<path d="M36 12v32m-12-12 12 12 12-12M16 43v10h40V43"/>',
};
const escape=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function functionImage(svg:string,preset:{id:string;title:string}){
 const symbol=symbols[preset.id];
 if(symbol)return svg.replace(/<g\b[^>]*>[\s\S]*?<\/g>/,`<g fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${symbol}</g>`);
 const badge=preset.title.replace(/\n/g,' ').split(/\s+/).map(word=>word[0]).join('').slice(0,3).toUpperCase();
 return svg.replace('</svg>',`<rect x="45" y="4" width="23" height="17" rx="4" fill="#17212c"/><text x="56.5" y="16" fill="white" font-family="Arial,sans-serif" font-size="10" font-weight="bold" text-anchor="middle">${escape(badge)}</text></svg>`);
}
