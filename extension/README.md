# Positron Deck IDE extension

Positron Deck is available on both stores: get IDE extension **0.2.1** from [Open VSX](https://open-vsx.org/extension/positron-deck/positron-deck) and Stream Deck companion **0.3.3** from the [Elgato Marketplace](https://marketplace.elgato.com/product/positron-deck-b287cbb8-baec-4f5c-a249-8cdfc2732eca). Both are free and open source. The companion offers 14 configurable action groups covering all 192 functions.

192 hotkey-driven commands for Positron Desktop, Positron Pro in Workbench and compatible VS Code functionality. This is the IDE half of [Positron Deck](https://github.com/JanWein/positron-deck).

[Full documentation](https://janwein.github.io/positron-deck/) · [Command reference](https://github.com/JanWein/positron-deck/blob/main/docs/COMMANDS.md) · [Downloads](https://github.com/JanWein/positron-deck/releases/latest)

Download the IDE extension from Open VSX and install the VSIX with Extensions → ⋯ → Install from VSIX. On Workbench install inside the remote Positron session. The companion is optional: every action also appears in the Command Palette under Positron Deck. If you use a Stream Deck, install the Windows companion from Elgato Marketplace; it requires Windows 10+ and Stream Deck 7.1+. Both packages are also available for manual installation in the [latest GitHub release](https://github.com/JanWein/positron-deck/releases/latest).

Navigation, native Ctrl+Enter-style execution, script cells, editor helpers, data/plot actions, layout presets, Git, R packages, Quarto, application tasks and deployment providers are included. The first 32 mappings remain compatible with 0.1; new actions use two-stroke chords.

Run **Check Action Availability** for host-specific diagnostics. Custom workflows have eight dedicated slots and finite task gates. See the [workflow guide](https://github.com/JanWein/positron-deck/blob/main/docs/WORKFLOWS.md).

No IDE network listener or credential storage. Native commands are preferred and capability-checked. Positron-only features require the corresponding installed version and active context. Generic VS Code actions require their providers. Trust is required for execution; packages are not automatically installed.

Build from the repository root with `npm run generate`, then `npm --prefix extension test` and `npm --prefix extension run package`. MIT licensed; independent of Posit and Elgato.
