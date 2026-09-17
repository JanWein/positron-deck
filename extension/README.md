# Positron Deck IDE extension

Marketplace status (17 September 2026): the IDE extension is under review on Open VSX; Stream Deck plugin 0.2.1 is pending Elgato review and will publish automatically after approval. Neither listing is public yet. Use the GitHub release installers while reviews are pending. Plugin 0.2.1 is a packaging update and works with IDE extension 0.2.0.

192 hotkey-driven commands for Positron Desktop, Positron Pro in Workbench and compatible VS Code functionality. This is the IDE half of [Positron Deck](https://github.com/JanWein/positron-deck).

[Full documentation](https://janwein.github.io/positron-deck/) · [Command reference](https://github.com/JanWein/positron-deck/blob/main/docs/COMMANDS.md) · [Downloads](https://github.com/JanWein/positron-deck/releases/latest)

Install the VSIX with Extensions → Install from VSIX. On Workbench install inside the remote session. The companion is optional: every action also appears in the Command Palette under Positron Deck.

Navigation, native Ctrl+Enter-style execution, script cells, editor helpers, data/plot actions, layout presets, Git, R packages, Quarto, application tasks and deployment providers are included. The first 32 mappings remain compatible with 0.1; new actions use two-stroke chords.

Run **Check Action Availability** for host-specific diagnostics. Custom workflows have eight dedicated slots and finite task gates. See the [workflow guide](https://github.com/JanWein/positron-deck/blob/main/docs/WORKFLOWS.md).

No IDE network listener or credential storage. Native commands are preferred and capability-checked. Positron-only features require the corresponding installed version and active context. Generic VS Code actions require their providers. Trust is required for execution; packages are not automatically installed.

Build from the repository root with `npm run generate`, then `npm --prefix extension test` and `npm --prefix extension run package`. MIT licensed; independent of Posit and Elgato.
