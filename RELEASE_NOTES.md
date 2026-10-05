Positron Deck 0.3.3 fixes Insert Code Cell in Quarto documents and function-specific Stream Deck button images.

| Component | Version |
|---|---|
| Positron / VS Code extension | 0.2.1 |
| Stream Deck plugin | 0.3.3 |

Install `positron-deck-0.2.1.vsix` in Positron or your remote Workbench session. Install the accompanying Stream Deck plugin 0.3.3 on Windows.

Insert Code Cell now calls `quarto.insertCodeCell` for Quarto `.qmd` documents and `positron.insertCodeCell` for R/Python scripts. Previously it always called the script-cell command, which did not insert a Quarto chunk. Both native commands may be installed at the same time; routing follows the active document rather than command availability. Missing Quarto support produces a clear error.

The hotkey and existing Stream Deck button configuration remain unchanged. Regression tests cover Quarto language detection, the .qmd extension, R/Python scripts and missing Quarto support.

Function-specific button images are now sent as base64 SVG data URLs, with an explicit target for both hardware and software. Previously raw SVG strings could leave the category image unchanged. Protocol tests validate the encoded image format and decode it to verify the selected function artwork.
