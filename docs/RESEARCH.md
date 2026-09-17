# Source audit and workflow rationale

Checked 17 September 2026. This is a capability-based adapter, not a guarantee that upstream-main features exist in every stable Positron build.

## Official user documentation

- [Keyboard shortcuts](https://positron.posit.co/keyboard-shortcuts.html): execute selected code/current statement, execution ranges, console focus and help.
- [Code cells](https://positron.posit.co/code-cells.html): cell-based exploration in scripts.
- [Layouts](https://positron.posit.co/layout.html): Stacked, Side-by-side, Notebook, Assistant; configurable pane placement.
- [Data Explorer](https://positron.posit.co/data-explorer.html): inspect files and runtime objects, visual summaries and filtering beside code.
- [VS Code keybindings](https://code.visualstudio.com/docs/configure/keybindings): native context-sensitive command mapping.
- [VS Code API](https://code.visualstudio.com/api/references/vscode-api): command discovery, task completion events, file saving and workspace trust.
- [Elgato manifest](https://docs.elgato.com/streamdeck/sdk/references/manifest/): plugin actions, controller support, runtime and version declaration.

## Audited Positron implementation paths

All paths refer to [posit-dev/positron](https://github.com/posit-dev/positron). Links are upstream-main references and can evolve.

| Area | Source |
|---|---|
| Native statement execution and console | [positronConsoleActions.ts](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/positronConsole/browser/positronConsoleActions.ts) |
| Script cell execution and navigation | [positron-code-cells package](https://github.com/posit-dev/positron/blob/main/extensions/positron-code-cells/package.json) |
| Layout presets | [layout definitions](https://github.com/posit-dev/positron/tree/main/src/vs/workbench/services/positronLayout/browser/layouts) |
| New Data Connections activity view | [Data Connections contribution](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/positronDataConnections/browser/positronDataConnections.contribution.ts) |
| Classic Connections pane | [Connections contribution](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/positronConnections/browser/positronConnections.contribution.ts) |
| Data Explorer and filter-to-code dialog | [Data Explorer actions](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/positronDataExplorerEditor/browser/positronDataExplorerActions.ts) |
| Plots, save/copy, sizing | [Plot actions](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/positronPlots/browser/positronPlotsActions.ts) |
| Variables | [Variables contribution](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/positronVariables/browser/positronVariables.contribution.ts) |
| Runtime selection and sessions | [Runtime actions](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/languageRuntime/browser/languageRuntimeActions.ts) |
| Positron notebook commands | [Notebook contribution](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/positronNotebook/browser/positronNotebook.contribution.ts) |
| Packages view | [Packages contribution](https://github.com/posit-dev/positron/blob/main/src/vs/workbench/contrib/positronPackages/browser/positronPackages.contribution.ts) |

View container IDs receive open commands from the VS Code view framework. The bridge checks command registration before dispatch. Lazy extensions may activate only when used; the diagnostics report describes registration at the time it runs.

## Design conclusions

1. Native Ctrl+Enter behavior is better than manually extracting a single line because it handles complete statements and cursor advancement.
2. R/Python script cells offer a useful incremental iteration surface without changing file format. They get dedicated actions, distinct from notebook actions.
3. Data inspection, plotting and code are separate surfaces that benefit from dedicated focus buttons and a repeatable workspace preset.
4. Data Explorer's native conversion dialog can help turn supported interactive exploration into reproducible code; availability and exact conversion semantics remain owned by Positron.
5. Task exit codes provide a concrete completion boundary for a quality gate. Native command dispatch alone is insufficient.
6. A hotkey-only architecture cannot provide runtime state on hardware, acknowledge IDE execution or detect an in-window browser tab switch. The UI and documentation do not promise those capabilities.

These are engineering inferences and workflow proposals from official feature documentation, not a measurement of how frequently the community uses each action.
