# Positron Deck Stream Deck companion

The companion exposes **14 configurable actions with 192 selectable functions**. Drag a group onto a button, then choose its function in the property inspector. The title and icon follow your selection. Windows 10+ x64/ARM64 and Stream Deck 7.1+ are required.

Stream Deck companion **0.3.3** is available on the [Elgato Marketplace](https://marketplace.elgato.com/product/positron-deck-b287cbb8-baec-4f5c-a249-8cdfc2732eca). It works with IDE extension **0.2.1**, available on [Open VSX](https://open-vsx.org/extension/positron-deck/positron-deck). Both are free and open source.

Groups: Code, Navigation, Editor, Data, Layout, Git, Terminal, Debug, Notebooks, Language Tools, Quarto, Apps, Deploy and Workflows.

**Language Tools** includes shared execution/testing/runtime commands plus existing R package tools. Choose Active file / runtime, R, Python or Other supported language to filter the menu. Python and other languages use the existing project-aware providers and native IDE commands. The selector does not change the active runtime or create support for an unsupported language. Quarto has Render, Preview and Quarto Workspace.

Existing buttons remain functional through hidden legacy action IDs. New buttons use grouped actions. Changing a function resets a custom shortcut so an old override cannot accidentally run the previous function.

[Documentation and XL preview](https://janwein.github.io/positron-deck/) · [Elgato Marketplace](https://marketplace.elgato.com/product/positron-deck-b287cbb8-baec-4f5c-a249-8cdfc2732eca) · [Open VSX](https://open-vsx.org/extension/positron-deck/positron-deck) · [Manual downloads](https://github.com/JanWein/positron-deck/releases/latest)

Install companion 0.3.3 from Elgato Marketplace and IDE extension 0.2.1 from Open VSX. For manual installation, double-click `org.positron-deck.shortcuts.streamDeckPlugin` on Windows and install `positron-deck-0.2.1.vsix` in Positron using Extensions → ⋯ → Install from VSIX. In Workbench, install the IDE extension inside your remote Positron session. Drag one of the 14 grouped actions from the Positron Deck category onto a button and select its function. Keep the correct IDE window or Workbench browser tab in the foreground. Every button can use the default, alternative mapping or a custom chord. The inspector displays its behavior and command ID.

The plugin sends Windows hotkeys using SendInput. No credentials, shell helper or IDE network connection is required. The Elgato SDK's ordinary local connection is used only to communicate with the Stream Deck application. Feedback signals input-injection failures, not IDE execution results. Window switching between chord strokes aborts the sequence; tab changes within one browser window cannot be detected.

Use the [eight XL layout plans](https://github.com/JanWein/positron-deck/blob/main/docs/xl-layouts.json) with page-navigation buttons in the top row and 24 actions below. A native Stream Deck profile is not bundled.

From the repository root: `npm run generate`, `npm --prefix streamdeck test`, `npm --prefix streamdeck run package`. The package includes the required Windows native modules. The companion is Windows-only; the IDE extension can run on other supported platforms.
