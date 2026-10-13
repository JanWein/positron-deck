<p align="center"><img src="docs/assets/logo.svg" width="76" alt="Positron Deck logo"></p>
<h1 align="center">Positron Deck</h1>
Positron Deck is available on both stores: get Stream Deck companion **0.3.3** from the [Elgato Marketplace](https://marketplace.elgato.com/product/positron-deck-b287cbb8-baec-4f5c-a249-8cdfc2732eca) and IDE extension **0.2.1** from [Open VSX](https://open-vsx.org/extension/positron-deck/positron-deck). Both are free and open source. The companion groups 192 functions into 14 configurable actions and fixes function-specific button images; IDE extension 0.2.1 fixes Quarto code-cell insertion.

<p align="center"><strong>Your work, at your fingertips.</strong><br>192 tactile shortcuts for Positron, a Stream Deck companion and a workflow toolkit.</p>
<p align="center"><a href="https://janwein.github.io/positron-deck/">Documentation & interactive XL preview</a> · <a href="https://marketplace.elgato.com/product/positron-deck-b287cbb8-baec-4f5c-a249-8cdfc2732eca">Elgato Marketplace</a> · <a href="https://open-vsx.org/extension/positron-deck/positron-deck">Open VSX</a> · <a href="docs/COMMANDS.md">All actions</a></p>

## What is inside?

| Component | Purpose |
|---|---|
| 🧩 [IDE extension](extension/) | Positron / VS Code commands, keybindings, project detection and providers |
| 🎛️ [Stream Deck companion](streamdeck/) | 192 selectable Windows hotkey actions, category icons and per-button settings |
| 🔁 [Workflows](docs/WORKFLOWS.md) | Six built-in recipes, a chooser and eight configurable workflow buttons |
| 📖 [Documentation](https://janwein.github.io/positron-deck/) | Searchable action catalog, exact mappings, setup, compatibility and troubleshooting |

### Explore the entire workspace

- **Navigation:** Explorer, Search, Data Connections, classic Connections, Source Control, Extensions, Run and Debug, Testing, Assistant, Variables, Plots, Help, History, Viewer, Packages and Sessions.
- **Code:** Ctrl+Enter-style statement execution, run to/from cursor, script cells, interpreter selection, console controls and contextual help.
- **Editor:** comments, duplicate/move lines, rename, definitions, references, multi-cursor selection, formatting and diagnostics.
- **Data:** open the dataframe at the cursor, summaries, sorting, convert filters to code when supported, browse/copy/export plots.
- **Layouts:** Stacked, Side-by-side, Notebook, Assistant, Help docking, split editors, grids, pane controls, Zen mode and zoom.
- **Delivery:** Git operations, R package development, pytest/native testing, Quarto, Shiny/Streamlit/FastAPI and configurable deployments.

Native features are version- and context-dependent. Run **Positron Deck: Check Action Availability** to inspect your installation.

## Install

1. Get IDE extension **0.2.1** from [Open VSX](https://open-vsx.org/extension/positron-deck/positron-deck). To install the downloaded VSIX, open **Extensions → ⋯ → Install from VSIX…** in Positron. In Workbench, do this in your remote Positron session.
2. Get Stream Deck companion **0.3.3** from the [Elgato Marketplace](https://marketplace.elgato.com/product/positron-deck-b287cbb8-baec-4f5c-a249-8cdfc2732eca) and follow its installation prompts. Requires Stream Deck **7.1+**, Windows **10+**, x64 or ARM64.
3. Drag a group from **Positron Deck** onto a button and choose its function in the Property Inspector.
4. First verify **Positron Deck: Open Terminal** from the IDE Command Palette. Focus the correct IDE window or Workbench browser tab before pressing a button.

For manual installation, both packages remain available in the [latest GitHub release](https://github.com/JanWein/positron-deck/releases/latest): install `positron-deck-0.2.1.vsix` in Positron and double-click `org.positron-deck.shortcuts.streamDeckPlugin` on Windows.

Existing 0.1 action UUIDs, command IDs and default hotkeys remain unchanged. The IDE extension identifier remains `positron-deck.positron-deck` for upgrade continuity.

## Architecture

Stream Deck sends local Windows hotkeys. The focused Positron/Workbench window resolves them to `positronDeck.*`. The extension executes native commands wherever possible, using project-aware providers for the remaining work.

There is **no direct IDE network connection**, credential storage or live IDE-to-button feedback. The Elgato SDK has its own ordinary local connection to the Stream Deck application. Test dispatch, process completion and deployment success are deliberately distinguished.

## Shortcuts and XL pages

The first 32 actions retain F13–F24 combinations. New actions use `Ctrl+Alt+Shift+F1` through `F5` followed by a letter or digit. The companion sends the sequence automatically. Every action also offers an alternative or custom mapping.

See [all exact keybindings](extension/docs/KEYBINDINGS.md), [alternative bindings](docs/keybindings-fallback.json) and [eight XL page plans](docs/xl-layouts.json). The top XL row is reserved for eight page-navigation buttons; each page has 24 actions below it. These are layout plans, not a native `.streamDeckProfile` import.

Run **Enable Hotkeys in Terminal** to add the Deck commands to your user-level `terminal.integrated.commandsToSkipShell` after confirmation. Browser, keyboard layout and focus behavior need local validation.

## Workflows and configuration

[The workflow guide](docs/WORKFLOWS.md) includes ready-to-adapt R and Python examples. A custom workflow can save files, execute commands and wait for finite tasks to exit with code zero. Failed, cancelled or indeterminate tasks stop the chain. Custom workflows always request confirmation. Native commands can return before their work finishes; use task gates for checked test-to-deploy flows.

Deployment is unconfigured by default. Configure `positronDeck.deploy.provider` as `positPublisher`, `git`, `task` or `custom`. Credentials stay with the selected provider. See the [setup and settings guide](docs/SETUP.md) and [machine-readable settings reference](docs/settings.json).

## Build, test and package

Use Node 24+ and npm:

```sh
npm --prefix extension ci
npm --prefix streamdeck ci
npm run generate
npm run lint
npm test
npm run package
```

Outputs:

- `extension/positron-deck-0.2.1.vsix`
- `streamdeck/dist/org.positron-deck.shortcuts.streamDeckPlugin`

`catalog/actions.json` is the single source for action metadata. The generator produces both command catalogs, keybindings, plugin presets, icons and reference documentation. Custom provider logic is modular under `extension/src/`. No business-specific logic or target configuration is included.

## Validation and limitations

Tests cover registration, native delegation, trust boundaries, failures/cancellation, task-gated workflows, mapping consistency, Windows input encoding, focus changes, Elgato protocol registration and inspector settings. CI packages and validates the plugin using the official Elgato CLI.

Hardware and graphical IDE acceptance remains necessary: Windows + Stream Deck, real R/Python runtimes, each supported Positron version and Workbench browser delivery. The companion is Windows-only. VS Code supports generic actions and installed providers; Positron-specific actions display an availability message when missing. No automatic package installation is performed.

See [testing](TESTING.md), [source research](docs/RESEARCH.md), [contributing](CONTRIBUTING.md) and [MIT license](LICENSE).

Independent community project by Jan-Hendrik Weinert. Not affiliated with Posit or Elgato.

## Configurable Stream Deck actions

Companion 0.3.3 exposes 14 configurable groups with all 192 functions available in the property inspector. Language Tools includes R, Python and active-language options; Quarto has a dedicated group. Existing button IDs remain supported. See [companion setup](streamdeck/README.md).
