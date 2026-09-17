# Marketplace submission

Prepared for Positron Deck 0.2.0. These files do not mean that either marketplace listing is published. `listing.json` records the actual submission status and leaves listing URLs empty until they are verified.

## Open VSX

Publish the existing GitHub release artifact `positron-deck-0.2.0.vsix` under namespace `positron-deck`, preserving the extension ID `positron-deck.positron-deck`.

The Eclipse account needs to be linked to the publishing GitHub account and the Open VSX Publisher Agreement accepted by the account holder. Check namespace availability before publishing. The registry's Extensions tab supports VSIX uploads without creating a long-lived publishing token.

## Elgato Marketplace

Use the existing release artifact `org.positron-deck.shortcuts.streamDeckPlugin`. Keep the UUID `org.positron-deck.shortcuts` and the existing action IDs so installed buttons continue working. The listing is free.

- App icon: `app-icon.png`, 288 × 288.
- Thumbnail: `thumbnail.png`, 1920 × 960.
- Gallery: `gallery-actions.png`, `gallery-workflows.png`, `gallery-setup.png`, each 1920 × 960.
- Product description: `elgato-description.txt`.
- Website, support and source links: `listing.json`.

The artwork uses the project's own logo and action icons. It illustrates actual features without presenting mockups as screenshots of a running IDE or a physical device. Vector originals and a generator are included; regeneration requires Python with CairoSVG (`python -m pip install cairosvg`, then `python marketplace/generate-media.py`).

Use the author's name, JanWein handle and GitHub support link for the Maker organization. The account holder must choose the region (Elgato says it cannot be changed) and review the Maker Agreement before submission.

Elgato reviews submissions before publication. A submitted or approved item must not be described as available until its public listing works. The plugin intentionally exposes 192 individually draggable, configurable actions, as requested for this project. Elgato recommends grouping related actions and staying between 2 and 30; this may require changes during review. Keep all existing UUIDs if a later revision hides legacy actions and introduces grouped selectors.

The automated tests and official package validation passed for the release. Physical Windows/Stream Deck and graphical Positron/Workbench acceptance are still outstanding; do not claim that those tests or a demonstration video have been completed.

## Documentation after publication

Once each listing is live, record its verified URL in `listing.json` and update:

- `README.md`
- `docs/index.html` (download links and both setup cards)
- `docs/SETUP.md`
- `extension/README.md`
- `streamdeck/README.md`
- any remaining installation guidance found by searching for `Install from VSIX`, `.streamDeckPlugin` and `releases/latest`.

Keep GitHub installers as the manual-install option. Do not imply that an Open VSX publication is also a Microsoft Visual Studio Marketplace publication. Preserve the Windows-only companion requirement, remote-session installation instructions and foreground-window requirement.

## Official requirements checked

- [Open VSX publishing](https://github.com/eclipse-openvsx/openvsx/wiki/Publishing-Extensions)
- [Elgato distribution](https://docs.elgato.com/streamdeck/sdk/introduction/distribution/)
- [Elgato product artwork and listing requirements](https://docs.elgato.com/guidelines/products/)
- [Elgato plugin guidelines](https://docs.elgato.com/guidelines/stream-deck/plugins/)
- [Elgato review process](https://docs.elgato.com/maker-console/review-process/)
