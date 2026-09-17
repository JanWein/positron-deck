# Setup, providers and troubleshooting

The [documentation website](https://janwein.github.io/positron-deck/) contains the full illustrated guide and every setting. The raw [settings reference](settings.json) is generated from the extension manifest.

## Installation and upgrade

Install `positron-deck-0.2.0.vsix` from Extensions → Install from VSIX in Positron or in the Workbench session. Double-click the `.streamDeckPlugin` on the local Windows machine. Keep both at the same version. The original 32 action IDs, plugin UUIDs and default mappings are stable.

No separate desktop companion service is required. The Stream Deck plugin is the companion. Install no server listener, reverse proxy or Kubernetes service.

## Providers

| Area | Resolution |
|---|---|
| Execution | Native Positron statement execution; optional runtime API fallback; installed R/Python extension commands in VS Code |
| Git | VS Code's Git extension, with ordinary native UI prompts |
| Testing | Explicit `positronDeck.testing.provider`, or auto: native profile, R package, pytest |
| R packages | devtools, styler or lintr in a detected package; no automatic installs |
| Quarto | Installed Quarto command where suitable, otherwise the configured Quarto executable |
| Apps | R Shiny / Python Shiny / Streamlit / FastAPI detection; choice on ambiguity; owned tasks |
| Deployment | `none` by default; `positPublisher`, `git`, `task` or `custom` |

A plain VS Code window requires its appropriate R, Python, Quarto, Git and testing providers. Positron-specific actions are not emulated in VS Code.

Deployment settings: `positronDeck.deploy.provider`, `.task`, `.command`, `positronDeck.confirmDeploy`. Custom shell deployment always asks for confirmation. Publisher retains credential management. Git uses the selected repository's own remote and branch. The custom provider runs an explicitly configured workspace command in a trusted workspace.

Executable overrides: `positronDeck.r.executable`, `.python.executable`, `.quarto.executable`. Runtime paths are used when available; fallbacks require executables on PATH. Set a Python environment explicitly when needed.

Logging: `positronDeck.logging.level` (`off`, `error`, `info`, `debug`). Notifications: `positronDeck.showNotifications`. The output channel excludes source code, credentials and raw provider error strings.

## Keybindings

New commands use two-stroke chords with Ctrl+Alt+Shift+F1 through F5. The companion sends each stroke, with a configurable 50–1000 ms gap (120 ms default). The foreground window must not change. The first 32 mappings use F13–F24 as before. All mappings are in [COMMANDS.md](COMMANDS.md).

For fallback mode, merge [keybindings-fallback.json](keybindings-fallback.json) into the user's existing keybindings array. Do not overwrite unrelated entries. Custom mode accepts up to four strokes separated by spaces, such as `ctrl+k ctrl+s`; assign the same sequence to the intended IDE command. Standard shortcuts such as Ctrl+Enter remain native and are not reassigned globally by this extension.

Commands are disabled while Quick Open is active. Navigation can run in restricted workspaces; execution and mutation commands require workspace trust. Some commands need editor focus, a selected notebook cell, an active Data Explorer or a selected plot.

For terminal focus, run **Enable Hotkeys in Terminal**. It asks before adding Deck commands to your global `terminal.integrated.commandsToSkipShell` array and preserves unrelated entries.

## Troubleshooting order

1. Run the exact Deck command from the Command Palette. If it fails here, investigate the IDE/provider first.
2. Run **Check Action Availability**. Missing commands can indicate older Positron, disabled optional views or inactive extensions.
3. If the command works in the palette, inspect keyboard delivery and duplicate mappings with the native Keyboard Shortcuts Troubleshooting command.
4. Verify the active Windows window and Workbench tab. The companion does not auto-focus the IDE and cannot validate the destination.
5. Release physical modifiers. Windows input injection is blocked when modifiers are held, and can fail across elevation levels. Use ordinary matching privilege levels.
6. Inspect **Positron Deck: Show Log**, then the relevant Git, task, Console or testing output.

The companion's alert icon indicates injection failure only. It cannot know whether the IDE executed the command or whether the requested test/deployment passed.
