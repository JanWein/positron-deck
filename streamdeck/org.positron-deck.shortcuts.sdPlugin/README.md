# Positron Deck Stream Deck companion

The companion exposes **14 configurable actions with 192 selectable functions**. Drag a group onto a button, then choose its function in the property inspector. The title and icon follow your selection. Windows 10+ x64/ARM64 and Stream Deck 7.1+ are required.

Version 0.3.0 addresses Elgato's review feedback. Marketplace approval is pending revision and a live Windows demo. The IDE extension is available on [Open VSX](https://open-vsx.org/extension/positron-deck/positron-deck).

Groups: Code, Navigation, Editor, Data, Layout, Git, Terminal, Debug, Notebooks, Language Tools, Quarto, Apps, Deploy and Workflows.

**Language Tools** includes shared execution/testing/runtime commands plus existing R package tools. Choose Active file / runtime, R, Python or Other supported language to filter the menu. Python and other languages use the existing project-aware providers and native IDE commands. The selector does not change the active runtime or create support for an unsupported language. Quarto has Render, Preview and Quarto Workspace.

Existing buttons remain functional through hidden legacy action IDs. New buttons use grouped actions. Changing a function resets a custom shortcut so an old override cannot accidentally run the previous function.

[Documentation and XL preview](https://janwein.github.io/positron-deck/) · [Download](https://github.com/JanWein/positron-deck/releases/latest)

Double-click `org.positron-deck.shortcuts.streamDeckPlugin`, install the matching 0.2.0 VSIX in Positron, and drag one of the 14 grouped actions from the Positron Deck category onto a button and select its function. Keep the correct IDE window or Workbench browser tab in the foreground. Every button can use the default, alternative mapping or a custom chord. The inspector displays its behavior and command ID.

The plugin sends Windows hotkeys using SendInput. No credentials, shell helper or IDE network connection is required. The Elgato SDK's ordinary local connection is used only to communicate with the Stream Deck application. Feedback signals input-injection failures, not IDE execution results. Window switching between chord strokes aborts the sequence; tab changes within one browser window cannot be detected.

Use the [eight XL layout plans](https://github.com/JanWein/positron-deck/blob/main/docs/xl-layouts.json) with page-navigation buttons in the top row and 24 actions below. A native Stream Deck profile is not bundled.

From the repository root: `npm run generate`, `npm --prefix streamdeck test`, `npm --prefix streamdeck run package`. The package includes the required Windows native modules. The companion is Windows-only; the IDE extension can run on other supported platforms.
