# Testing and acceptance

Run `npm test`, `npm run lint` and `npm run package` from the root after installing both package dependencies.

Automated tests cover the project-aware providers, all contributed action registrations, trust boundaries, Positron adapter behavior, Ctrl+Enter delegation, unavailable commands, save cancellation, recursive workflow rejection, custom confirmation, finite task success/failure, background-task rejection and mapping synchronization. Companion tests cover Windows INPUT layout, virtual keys, recovery, chord focus changes, debounce, custom mapping, property-inspector settings and the Elgato registration protocol.

The official Elgato CLI validates the produced package. The VSIX is built with `vsce`. These checks are not a graphical Positron or physical Windows hardware test.

## Manual acceptance matrix

| Scenario | Expected outcome |
|---|---|
| Positron Desktop, R/Python, complete multi-line statement | Run Selection uses native parser-aware execution |
| Positron/Workbench, Explorer/Search/SCM/Extensions | Each button focuses its matching view |
| Optional Data Connections/Packages/Sessions absent | Helpful availability message; other commands still work |
| Script cells and Positron notebook editor | Correct cell action in the correct editor |
| Layout presets and pane toggles | Native arrangement changes, reset asks first |
| Standard/fallback/custom chords on Windows | Identical IDE command; no stuck modifiers |
| Browser tab switch between strokes | Verify local delivery; the plugin only detects window changes, not tab changes |
| Workspace without trust | Navigation works; project execution is blocked |
| Finite task exits 0 / nonzero / is terminated | Next step runs only for exit 0 |
| Task with silent test failures and exit 0 | Fix the task definition; an extension cannot infer failure from misleading exit codes |
| Code, test or deployment failure | Relevant output is visible; no false success claim on hardware |

Use a disposable project to test Git, formatting, runtime restart and deployment confirmations. No live deployment target is needed for installation acceptance.
