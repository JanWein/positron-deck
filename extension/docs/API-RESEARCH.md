# API research and decisions

Checked against official documentation and upstream source on 2026-09-16. These are source compatibility observations, not a claim of end-to-end testing in every host release.

Resolved repository snapshots:

| Repository | Revision |
| --- | --- |
| posit-dev/positron | `990dde556c26f9a7ff1449a59d2226ffead64190` |
| microsoft/vscode | `de1a430a2f394735221e3a5198a074b85fd64c87` |
| quarto-dev/quarto-vscode | `53f3621d4e3753ffd6a43d15fcdb0947d767dfe1` |
| posit-dev/publisher | `bd7fe0fb3a863b4725c93a17df8c25eb60d07fb7` |

## Runtime adapter

[Official Positron API declarations](https://github.com/posit-dev/positron/blob/990dde556c26f9a7ff1449a59d2226ffead64190/src/positron-dts/positron.d.ts) define the `positron` module, `runtime.executeCode`, `getForegroundSession`, `getPreferredRuntime`, `restartSession` and `interruptSession`. The source also exposes optional state access on a base session. The adapter imports the module lazily and keeps it external to the bundle. Ordinary VS Code therefore does not fail activation if the module is absent.

Code execution supplies language, text, focus, the active session ID and document URI. Older hosts may return a boolean acceptance value instead of the current result object. The adapter handles a false acceptance value and checks optional members before use. Positron itself can select a runtime when no foreground session exists. It never fabricates a runtime or assumes an R/Python extension exports a Positron runtime.

Runtime restart/interrupt command fallbacks are verified in [languageRuntimeActions.ts](https://github.com/posit-dev/positron/blob/990dde556c26f9a7ff1449a59d2226ffead64190/src/vs/workbench/contrib/languageRuntime/browser/languageRuntimeActions.ts):

- `workbench.action.language.runtime.restartActiveSession`
- `workbench.action.languageRuntime.interrupt`

Console focus is `workbench.action.positronConsole.focusConsole`, verified in [positronConsoleActions.ts](https://github.com/posit-dev/positron/blob/990dde556c26f9a7ff1449a59d2226ffead64190/src/vs/workbench/contrib/positronConsole/browser/positronConsoleActions.ts).

For VS Code R, [rTerminal.ts](https://github.com/REditorSupport/vscode-R/blob/master/src/rTerminal.ts) provides `runCommand(rCommand: string)`, which dispatches to the existing R terminal. `r.runSelection` and `r.runSource` come from the extension's command manifest. Python selection/file commands are capability checked and require the Python extension; process fallbacks use an explicitly configured interpreter, a Positron runtime executable, or PATH.

## Native commands

| Area | Verified command or API | Implementation decision |
| --- | --- | --- |
| Navigation | `workbench.action.terminal.focus`, `workbench.view.scm`, `workbench.actions.view.problems`, `workbench.action.showCommands` | Delegate through the command registry |
| Format | `editor.action.formatDocument` | Use the registered formatter |
| Git | `git.stageAll`, `git.commit`, `git.pull`, `git.push`, `git.sync`, `git.checkout`, `git.openChange` | Built-in Git owns repository selection, messages, conflicts and authentication |
| Git history | `workbench.scm.history.focus` | Focus the current Source Control Graph/History view; error clearly on older hosts |
| Testing | `testing.getSelectedProfiles`, `testing.runAll`, `testing.runCurrentFile` | Probe actual Run profiles; isolate the non-public discovery command; support explicit native override |
| Tasks | `vscode.Task`, `ProcessExecution`, `ShellExecution`, `tasks.executeTask`, `TaskExecution.terminate` | Scope work to the remote/local project and retain task ownership |
| Files | `workspace.fs`, `WorkspaceFolder`, `Uri` | Remote-aware reads; bounded metadata inspection |

[Git implementation](https://github.com/microsoft/vscode/blob/de1a430a2f394735221e3a5198a074b85fd64c87/extensions/git/src/commands.ts) confirms that repository-aware commands accept a resource URI as their first argument, otherwise invoking the native repository picker. Deployment passes the selected project URI; standalone Git commands preserve native selection behavior. The extension does not create or insert a commit message.

The [SCM source](https://github.com/microsoft/vscode/blob/de1a430a2f394735221e3a5198a074b85fd64c87/src/vs/workbench/contrib/scm/common/scm.ts) defines the history view ID. Focus commands for views are contributed by the workbench and checked before dispatch.

The [public VS Code declarations](https://github.com/microsoft/vscode/blob/de1a430a2f394735221e3a5198a074b85fd64c87/src/vscode-dts/vscode.d.ts) provide no public way to enumerate another extension's test controllers. [testExplorerActions.ts](https://github.com/microsoft/vscode/blob/de1a430a2f394735221e3a5198a074b85fd64c87/src/vs/workbench/contrib/testing/browser/testExplorerActions.ts) implements the selected-profile query, returning controller ID, label and kind. Command names are in [testing constants](https://github.com/microsoft/vscode/blob/de1a430a2f394735221e3a5198a074b85fd64c87/src/vs/workbench/contrib/testing/common/constants.ts). Just finding `testing.runAll` in the registry is not evidence that a provider exists. Discovery can miss a provider that has not activated; a documented configuration override is therefore necessary.

## Quarto and Publisher

[Quarto's preview command implementation](https://github.com/quarto-dev/quarto-vscode/blob/53f3621d4e3753ffd6a43d15fcdb0947d767dfe1/src/providers/preview/commands.ts) defines `quarto.render` and `quarto.renderProject`. Both are editor/workspace-oriented workflows and can open live previews. There is no explicit target-URI argument on those handlers. The project command chooses from visible editors/workspace folders, so a selected multi-root project uses an explicit CLI path instead.

Despite its name, `quarto.previewShortcut` belongs to [diagram/math preview commands](https://github.com/quarto-dev/quarto-vscode/blob/53f3621d4e3753ffd6a43d15fcdb0947d767dfe1/src/providers/diagram/commands.ts). It is not a document preview fallback.

[Posit Publisher's extension entrypoint](https://github.com/posit-dev/publisher/blob/bd7fe0fb3a863b4725c93a17df8c25eb60d07fb7/extensions/vscode/src/extension.ts) registers `posit.publisher.deployWithEntrypoint` with a URI argument. It opens Publisher and delegates deployment selection to its UI. Positron Deck intentionally opens this workflow instead of calling unverified internal deployment APIs or storing Connect credentials.

## Keybindings

The [VS Code keycode source](https://github.com/microsoft/vscode/blob/de1a430a2f394735221e3a5198a074b85fd64c87/src/vs/base/common/keyCodes.ts) includes F13 through F24, scan codes and Windows virtual-key mappings. [The public keyboard documentation](https://code.visualstudio.com/docs/configure/keybindings) lists F1 through F19 and platform modifier syntax. This difference is why the release includes both the requested F13-F24 mapping and a configurable ordinary-key chord fallback. Source support does not demonstrate browser or hardware delivery.

## Version 2

The exported `onDidChange` event and `getState()` snapshot are local extension APIs. Events describe command running/dispatched/failed/cancelled status. They do not yet aggregate Git cleanliness, branches, runtime lifecycle, external tests or remote deployments. Future collectors can be added separately before any optional device transport. No v2 networking is included in v1.
