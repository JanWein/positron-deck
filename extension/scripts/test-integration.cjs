const path=require('node:path');
const {runTests}=require('@vscode/test-electron');
const options={extensionDevelopmentPath:path.resolve(__dirname,'..'),extensionTestsPath:path.resolve(__dirname,'../test/integration/index.cjs'),launchArgs:['--disable-gpu','--no-sandbox','--skip-welcome','--skip-release-notes','--disable-workspace-trust']};
if(process.env.VSCODE_EXECUTABLE_PATH)options.vscodeExecutablePath=process.env.VSCODE_EXECUTABLE_PATH;
runTests(options).catch(error=>{console.error(error.message);process.exit(1)});
