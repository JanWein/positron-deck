<p align="center"><img src="docs/assets/logo.svg" width="76" alt="Positron Deck logo"></p>
<h1 align="center">Positron Deck</h1>
Marketplace status (17 September 2026): the IDE extension is under review on Open VSX; Stream Deck plugin 0.2.1 is pending Elgato review and will publish automatically after approval. Neither listing is public yet. Use the GitHub release installers while reviews are pending. Plugin 0.2.1 is a packaging update and works with IDE extension 0.2.0.

<p align="center"><strong>Your work, at your fingertips.</strong><br>192 tactile shortcuts for Positron, a Stream Deck companion and a workflow toolkit.</p>
<p align="center"><a href="https://janwein.github.io/positron-deck/">Documentation & interactive XL preview</a> · <a href="https://github.com/JanWein/positron-deck/releases/latest">Download both packages</a> · <a href="docs/COMMANDS.md">All actions</a></p>

## What is inside?

| Component | Purpose |
|---|---|
| 🧩 [IDE extension](extension/) | Positron / VS Code commands, keybindings, project detection and providers |
| 🎛️ [Stream Deck companion](streamdeck/) | 192 ready-to-drag Windows hotkey actions, category icons and per-button settings |
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

1. Download both files from the [latest release](https://github.com/JanWein/positron-deck/releases/latest).
2. In Positron, open **Extensions → ⋯ → Install from VSIX…** and select `positron-deck-0.2.0.vsix`. In Workbench, do this in your remote session.
3. On Windows, double-click `org.positron-deck.shortcuts.streamDeckPlugin`. Requires Stream Deck **7.1+**, Windows **10+**, x64 or ARM64.
4. Drag actions from **Positron Deck** onto buttons. Focus the correct IDE window or Workbench browser tab, then press a button.
5. First verify **Open Terminal** from the IDE Command Palette. Update both packages to 0.2.0 to use the new actions.

Existing 0.1 action UUIDs, command IDs and default hotkeys remain unchanged. The VSIX publisher ID remains `positron-deck` for upgrade continuity; this is not a claim of Marketplace publication.

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

- `extension/positron-deck-0.2.0.vsix`
- `streamdeck/dist/org.positron-deck.shortcuts.streamDeckPlugin`

`catalog/actions.json` is the single source for action metadata. The generator produces both command catalogs, keybindings, plugin presets, icons and reference documentation. Custom provider logic is modular under `extension/src/`. No business-specific logic or target configuration is included.

## Validation and limitations

Tests cover registration, native delegation, trust boundaries, failures/cancellation, task-gated workflows, mapping consistency, Windows input encoding, focus changes, Elgato protocol registration and inspector settings. CI packages and validates the plugin using the official Elgato CLI.

Hardware and graphical IDE acceptance remains necessary: Windows + Stream Deck, real R/Python runtimes, each supported Positron version and Workbench browser delivery. The companion is Windows-only. VS Code supports generic actions and installed providers; Positron-specific actions display an availability message when missing. No automatic package installation is performed.

See [testing](TESTING.md), [source research](docs/RESEARCH.md), [contributing](CONTRIBUTING.md) and [MIT license](LICENSE).

Independent community project by Jan-Hendrik Weinert. Not affiliated with Posit or Elgato.
