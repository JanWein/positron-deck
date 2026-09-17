# Contributing

Use Node 24+, npm and the commands in the root README. Keep both packages generic; do not commit workspace credentials or organization-specific defaults.

- Edit `catalog/actions.json` for command metadata. Preserve published command IDs, plugin UUIDs and existing hotkeys.
- Verify native command IDs against official source. Include a source in `docs/RESEARCH.md`. Capability-check version-dependent functionality.
- Add provider code under `extension/src/providers` and command modules under `extension/src/commands`. Avoid a single large dispatch file.
- Keep runtime dispatch distinct from completion. Workflow gates must observe task process exit, fail closed for unknown exits and stop after cancellation.
- Run `npm run generate`, `npm run lint`, `npm test` and `npm run package` before submitting.
- Update generated files with the generator. Include practical Windows/Positron/Workbench acceptance notes when behavior changes.

## Documentation

The static `docs/` site works on GitHub Pages without external scripts, fonts or analytics. `node scripts/check-docs.mjs` checks local links and mappings. Serve with `python -m http.server --directory docs 8080` for local viewing.

## Release

Bump the version in the generator, root package, plugin builder and release workflow together. Update release filenames in the README/site. The CI workflow validates and packages the source. Its release step only creates a version that does not already exist; it never overwrites an existing release.

## Report bugs

Include OS, Stream Deck version, IDE version, command ID, button mode, project type and whether the command succeeds from the IDE palette. Remove source code, secrets and private paths from logs before sharing.
