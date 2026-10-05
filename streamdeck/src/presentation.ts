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
 insertCell:'<rect x="12" y="10" width="48" height="42" rx="4"/><path d="M12 23h48m-34 8-7 7 7 7m18-14 7 7-7 7M36 28v20m-7-10h14"/>',
 showLog:'<path d="M18 50V10h28l10 10v30ZM46 10v12h10M25 29h24M25 37h24M25 45h15"/>',
 saveFile:'<path d="M13 10h38l8 8v34H13ZM23 10v15h24V10M24 52V35h24v17"/>',
 newFile:'<path d="M19 51V10h25l11 11v30ZM44 10v13h11M36 29v16m-8-8h16"/>',
 gitCommit:'<circle cx="36" cy="31" r="13"/><path d="M11 31h12m26 0h12m-31 0 5 5 8-10"/>',
 clearConsole:'<path d="M16 16h40m-33 0 3 35h20l3-35M29 16v-6h14v6m-11 9v17m8-17v17"/>',
 zoomIn:'<circle cx="31" cy="26" r="15"/><path d="m42 38 16 16M31 18v16m-8-8h16"/>',
 zoomOut:'<circle cx="31" cy="26" r="15"/><path d="m42 38 16 16M23 26h16"/>',
 debugContinue:'<path d="m24 12 29 20-29 20Z"/>',
 toggleBreakpoint:'<circle cx="36" cy="31" r="18"/>',
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
