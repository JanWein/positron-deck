# Contributing

Keep this companion generic and hotkey-only. The Positron Deck VSIX owns project actions; this plugin must not duplicate deployment, Git or runtime behavior.

- Follow the official Elgato SDK. Add actions to src/actions.json and keep the VSIX manifest snapshot/mappings synchronized.
- Do not add a connection to Positron, a remote server or a custom local listener. The SDK-owned local Stream Deck connection is the only runtime socket.
- Keep keyboard injection within src/windows.ts. Never implement custom shortcuts through shell evaluation, PowerShell policy overrides or arbitrary script commands.
- Do not log typed text, window titles, project details or credentials.
- Run build, tests, validation and packaging. Verify the resulting installation on Windows and a physical Stream Deck before public release.
- Add actual publisher/repository information before Marketplace publication. This development UUID is not a claim of domain ownership.

MIT licensed. See THIRD-PARTY-NOTICES.txt for bundled dependencies.
