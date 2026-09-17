# Contributing

Use Node.js 22+, run `npm ci`, and read README.md and docs/API-RESEARCH.md before changing adapters.

1. Keep all behavior generic. Do not add organization names, credentials, server addresses, repositories, branches or deployment targets.
2. Prefer verified native IDE commands and public APIs. Record the official source and signature for new integrations. Feature-check optional APIs and command IDs. Do not assume a command listing proves a test provider exists.
3. Keep command handlers small; add providers through the interfaces in src/providers. Project detection must remain bounded and side-effect free.
4. Respect workspace trust, confirmation, multi-root selection and the existing logging policy. Use ProcessExecution with separate arguments for known executables. ShellExecution is reserved for explicitly configured deployment commands.
5. Do not install R/Python packages automatically. Do not add a network transport in v1.
6. Add meaningful provider/error-path tests. Run `npm run lint`, `npm test`, `npm run mapping`, and `npm run package`. Run the extension-host test and relevant manual acceptance scenarios for integration changes.
7. Update commands, settings, keybindings and docs together. package.json is the command/keybinding source of truth. The mapping script regenerates supporting artifacts.

Before publication, configure the actual registered publisher and repository URL. Review the generated VSIX contents, test installation in Positron Desktop and Workbench, and record tested host/OS versions. Do not present mocked-host tests as hardware or browser acceptance.

Please submit a small pull request explaining the problem, resulting behavior and verification. Report security-sensitive findings privately to the eventual repository maintainer rather than posting secrets in an issue. No maintainer contact or repository URL is fabricated in this initial source release.
