# Positron Deck Stream Deck companion

Marketplace status (17 September 2026): the IDE extension is under review on Open VSX; Stream Deck plugin 0.2.1 is pending Elgato review and will publish automatically after approval. Neither listing is public yet. Use the GitHub release installers while reviews are pending. Plugin 0.2.1 is a packaging update and works with IDE extension 0.2.0.

192 ready-to-drag actions for Windows, synchronized with the Positron Deck IDE extension. Requires Windows 10+ x64/ARM64 and Stream Deck 7.1+.

[Documentation and XL preview](https://janwein.github.io/positron-deck/) · [Download](https://github.com/JanWein/positron-deck/releases/latest)

Double-click `org.positron-deck.shortcuts.streamDeckPlugin`, install the matching 0.2.0 VSIX in Positron, and drag actions from the Positron Deck category onto buttons. Keep the correct IDE window or Workbench browser tab in the foreground. Every button can use the default, alternative mapping or a custom chord. The inspector displays its behavior and command ID.

The plugin sends Windows hotkeys using SendInput. No credentials, shell helper or IDE network connection is required. The Elgato SDK's ordinary local connection is used only to communicate with the Stream Deck application. Feedback signals input-injection failures, not IDE execution results. Window switching between chord strokes aborts the sequence; tab changes within one browser window cannot be detected.

Use the [eight XL layout plans](https://github.com/JanWein/positron-deck/blob/main/docs/xl-layouts.json) with page-navigation buttons in the top row and 24 actions below. A native Stream Deck profile is not bundled.

From the repository root: `npm run generate`, `npm --prefix streamdeck test`, `npm --prefix streamdeck run package`. The package includes the required Windows native modules. The companion is Windows-only; the IDE extension can run on other supported platforms.
