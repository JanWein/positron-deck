Positron Deck 0.3.1 fixes function selection in the Stream Deck property inspector. This release includes both current installers:

| Component | Version | Install on |
|---|---|---|
| Stream Deck companion | 0.3.1 | Local Windows computer |
| Positron / VS Code extension | 0.2.0 | Positron, VS Code or your remote Workbench session |

### What changed

- Function selection stays selected instead of resetting to the first entry. The native dropdown is kept intact and changes made during connection setup are saved.
- Button titles follow the selected function. Common functions now have distinct symbols; other functions show a short function badge on their category icon.

- All 192 functions are available through 14 groups: Code, Navigation, Editor, Data, Layout, Git, Terminal, Debug, Notebooks, Language Tools, Quarto, Apps, Deploy and Workflows.
- Choose a function in the property inspector. The button title and icon update automatically.
- Language Tools provides filters for R, Python and other supported languages. Execution uses the active file and runtime in Positron.
- Existing buttons keep their action IDs and hotkeys. Legacy actions are hidden from the action list but remain supported.
- The website and setup guide explain the new configuration.

The IDE extension remains at 0.2.0 because its 192 commands and hotkeys are unchanged. It is the latest compatible version and is included here for a complete installation.

### Installation

Download both installers under Assets. Install `positron-deck-0.2.0.vsix` inside Positron or your Workbench session. Double-click `org.positron-deck.shortcuts.streamDeckPlugin` on Windows, then drag a group onto a button and choose its function.

Requires Windows 10+ (x64 or ARM64) and Stream Deck 7.1+. Focus the intended IDE window or Workbench tab before pressing a button.

Automated tests and official Elgato package validation pass. Practical testing with Windows, Positron runtimes and Stream Deck hardware remains necessary. The plugin sends local hotkeys and has no direct network connection to the IDE or live IDE status feedback.

[Documentation](https://janwein.github.io/positron-deck/) · [IDE extension on Open VSX](https://open-vsx.org/extension/positron-deck/positron-deck)
