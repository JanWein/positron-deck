# Action reference

Generated from `catalog/actions.json`. Host availability is checked at execution time. Positron actions may depend on the installed version or optional views.

## code

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Run Selection or Line | `positronDeck.runSelection`<br>`ctrl+alt+shift+f13` | Run selected code or the current complete statement in Positron, like Ctrl+Enter. Falls back to the current line through the runtime API on older hosts; R/Python extensions provide VS Code fallbacks. **Host:** Provider.   |
| Test Project | `positronDeck.test`<br>`ctrl+alt+shift+f14` | Prefer an available native Test Explorer profile, then R package tests, then pytest. Execution may continue after dispatch. **Host:** Provider.   |
| Run File | `positronDeck.runFile`<br>`ctrl+alt+shift+f21` | Save and run an R or Python source file in its matching runtime. An active Quarto document is rendered. **Host:** Provider.   |
| Open Terminal | `positronDeck.openTerminal`<br>`ctrl+alt+shift+f23` | Open Terminal. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Open Console | `positronDeck.openConsole`<br>`ctrl+alt+shift+f24` | Open Console. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Command Palette | `positronDeck.commandPalette`<br>`ctrl+shift+f13` | Command Palette. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Open Source Control | `positronDeck.openSourceControl`<br>`ctrl+shift+f17` | Open Source Control. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Format Document | `positronDeck.format`<br>`ctrl+shift+f18` | Format the active document with the installed formatter. **Host:** Provider.   |
| Restart Runtime | `positronDeck.restartRuntime`<br>`ctrl+shift+f23` | Restart the foreground interpreter after confirmation; in-memory objects are lost. **Host:** Provider.   |
| Open Problems | `positronDeck.openProblems`<br>`ctrl+shift+f24` | Open Problems. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Stop Execution | `positronDeck.stopExecution`<br>`ctrl+alt+f13` | Interrupt the foreground interpreter without terminating the IDE. **Host:** Provider.   |
| Test Current File | `positronDeck.testCurrentFile`<br>`ctrl+alt+f15` | Run tests for the active test file through a native test profile, testthat or pytest. **Host:** Provider.   |
| Show Log | `positronDeck.showLog`<br>`ctrl+alt+f20` | Open the Positron Deck output channel. Logs omit source code, credentials and raw provider errors. **Host:** Provider.   |
| Run without Advancing | `positronDeck.runWithoutAdvancing`<br>`ctrl+alt+shift+f2 u` | Run the selection or statement and keep the cursor in place. **Host:** Positron. Native: `workbench.action.positronConsole.executeCodeWithoutAdvancing`.  |
| Run to Cursor | `positronDeck.runToCursor`<br>`ctrl+alt+shift+f2 v` | Execute code from document start to the cursor. **Host:** Positron. Native: `workbench.action.positronConsole.executeCodeBeforeCursor`.  |
| Run from Cursor | `positronDeck.runFromCursor`<br>`ctrl+alt+shift+f2 w` | Execute code from the cursor to document end. **Host:** Positron. Native: `workbench.action.positronConsole.executeCodeAfterCursor`.  |
| Clear Console | `positronDeck.clearConsole`<br>`ctrl+alt+shift+f2 x` | Clear console output without removing runtime objects. **Host:** Positron. Native: `workbench.action.positronConsole.clearConsole`.  |
| Select Interpreter | `positronDeck.selectRuntime`<br>`ctrl+alt+shift+f2 y` | Select or start an interpreter session. **Host:** Positron. Native: `workbench.action.language.runtime.selectSession`.  |
| New Console Session | `positronDeck.newRuntime`<br>`ctrl+alt+shift+f2 z` | Start a separate interpreter session. **Host:** Positron. Native: `workbench.action.language.runtime.startNewConsoleSession`.  |
| Help at Cursor | `positronDeck.helpAtCursor`<br>`ctrl+alt+shift+f2 0` | Open documentation for the symbol at the cursor. **Host:** Positron. Native: `positron.help.showHelpAtCursor`.  |
| Run Code Cell | `positronDeck.runCell`<br>`ctrl+alt+shift+f5 i` | Run the current R or Python script cell, respecting Positron cell delimiters. **Host:** Positron. Native: `positron.runCurrentCell`.  |
| Run Cell and Advance | `positronDeck.runCellNext`<br>`ctrl+alt+shift+f5 j` | Execute the current script cell and advance to the next. **Host:** Positron. Native: `positron.runCurrentAdvance`.  |
| Run All Script Cells | `positronDeck.runAllCells`<br>`ctrl+alt+shift+f5 k` | Run all cells in the active R or Python script. **Host:** Positron. Native: `positron.runAllCells`.  |
| Run Script Cells Above | `positronDeck.runCellsAbove`<br>`ctrl+alt+shift+f5 l` | Run script cells above the current cell. **Host:** Positron. Native: `positron.runCellsAbove`.  |
| Run Script Cells Below | `positronDeck.runCellsBelow`<br>`ctrl+alt+shift+f5 m` | Run script cells below the current cell. **Host:** Positron. Native: `positron.runCellsBelow`.  |
| Next Code Cell | `positronDeck.nextCell`<br>`ctrl+alt+shift+f5 n` | Navigate to the next script cell. **Host:** Positron. Native: `positron.goToNextCell`.  |
| Previous Code Cell | `positronDeck.previousCell`<br>`ctrl+alt+shift+f5 o` | Navigate to the previous script cell. **Host:** Positron. Native: `positron.goToPreviousCell`.  |
| Insert Code Cell | `positronDeck.insertCell`<br>`ctrl+alt+shift+f5 p` | Insert a code-cell delimiter in an R or Python script. **Host:** Positron. Native: `positron.insertCodeCell`.  |

## app

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Quarto: Render | `positronDeck.render`<br>`ctrl+alt+shift+f15` | Render the active QMD document, or the detected Quarto project, with native commands or the Quarto CLI. **Host:** Provider.   |
| Run App | `positronDeck.runApp`<br>`ctrl+alt+shift+f22` | Detect R Shiny, Python Shiny, Streamlit or FastAPI; ask if multiple match; start an owned task. **Host:** Provider.   |
| Quarto: Preview | `positronDeck.preview`<br>`ctrl+shift+f22` | Launch Quarto preview through its native render workflow or the CLI. Preview is long-running. **Host:** Provider.   |
| Stop App | `positronDeck.stopApp`<br>`ctrl+alt+f19` | Terminate only the application task started by Positron Deck for this project. **Host:** Provider.   |

## git

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Git: Stage All | `positronDeck.gitStageAll`<br>`ctrl+alt+shift+f16` | Git: Stage All. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Git: Commit | `positronDeck.gitCommit`<br>`ctrl+alt+shift+f17` | Open the native Git commit flow. Enter your own commit message; none is generated or hardcoded. **Host:** Provider.   |
| Git: Pull | `positronDeck.gitPull`<br>`ctrl+alt+shift+f18` | Git: Pull. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Git: Push | `positronDeck.gitPush`<br>`ctrl+alt+shift+f19` | Git: Push. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Git: Sync | `positronDeck.gitSync`<br>`ctrl+shift+f14` | Git: Sync. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Git: Show Diff | `positronDeck.gitShowDiff`<br>`ctrl+shift+f15` | Show the native Git diff for the active file, or open Source Control when no suitable file exists. **Host:** Provider.   |
| Git: Open History | `positronDeck.gitOpenLog`<br>`ctrl+shift+f16` | Open native Source Control history, falling back to Source Control on older hosts. **Host:** Provider.   |
| Git: Checkout | `positronDeck.gitCheckout`<br>`ctrl+alt+f14` | Git: Checkout. Uses the existing project-aware provider; see the setup and provider guide. **Host:** Provider.   |
| Git: Fetch | `positronDeck.gitFetch`<br>`ctrl+alt+shift+f3 8` | Fetch remote references without merging. **Host:** Git. Native: `git.fetch`.  |
| Git: Stage File | `positronDeck.gitStageFile`<br>`ctrl+alt+shift+f3 9` | Stage the active file using the native Git extension. **Host:** Git. Native: `git.stage`.  |
| Git: Unstage All | `positronDeck.gitUnstageAll`<br>`ctrl+alt+shift+f4 a` | Move staged changes back to the working tree without discarding them. **Host:** Git. Native: `git.unstageAll`.  |
| Git: Create Branch | `positronDeck.gitBranch`<br>`ctrl+alt+shift+f4 b` | Create a branch using Git's native input UI. **Host:** Git. Native: `git.branch`.  |
| Git: Stash | `positronDeck.gitStash`<br>`ctrl+alt+shift+f4 c` | Stash tracked changes with native Git UI. **Host:** Git. Native: `git.stash`. Confirmation required. |
| Git: Pop Stash | `positronDeck.gitStashPop`<br>`ctrl+alt+shift+f4 d` | Apply and remove a stash through Git's native UI. **Host:** Git. Native: `git.stashPop`. Confirmation required. |

## deploy

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Deploy | `positronDeck.deploy`<br>`ctrl+alt+shift+f20` | Dispatch the configured Publisher, Git, task or custom provider. Default is none; deployment confirmation is enabled. **Host:** Provider.   |

## r

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| R Package: Lint | `positronDeck.rLint`<br>`ctrl+shift+f19` | Run lintr::lint_package() for the detected R package. **Host:** Provider.   |
| R Package: Check | `positronDeck.rCheck`<br>`ctrl+shift+f20` | Run devtools::check() for the detected R package. **Host:** Provider.   |
| R Package: Document | `positronDeck.rDocument`<br>`ctrl+shift+f21` | Run devtools::document() for the detected R package. **Host:** Provider.   |
| R Package: Test | `positronDeck.rTest`<br>`ctrl+alt+f16` | Run devtools::test() for the detected R package. **Host:** Provider.   |
| R Package: Load All | `positronDeck.rLoadAll`<br>`ctrl+alt+f17` | Run devtools::load_all() for the detected R package. **Host:** Provider.   |
| R Package: Style | `positronDeck.rStyle`<br>`ctrl+alt+f18` | Run styler::style_pkg() after confirmation. No package is installed automatically. **Host:** Provider.   |

## navigation

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Explorer | `positronDeck.openExplorer`<br>`ctrl+alt+shift+f1 a` | Open the project file explorer. **Host:** Any. Native: `workbench.view.explorer`.  |
| Search in Files | `positronDeck.openSearch`<br>`ctrl+alt+shift+f1 b` | Search across the workspace. **Host:** Any. Native: `workbench.view.search`.  |
| Extensions | `positronDeck.openExtensions`<br>`ctrl+alt+shift+f1 c` | Manage installed extensions and install a VSIX. **Host:** Any. Native: `workbench.view.extensions`.  |
| Run and Debug | `positronDeck.openDebug`<br>`ctrl+alt+shift+f1 d` | Open debug configurations and breakpoints. **Host:** Any. Native: `workbench.view.debug`.  |
| Test Explorer | `positronDeck.openTesting`<br>`ctrl+alt+shift+f1 e` | Open native testing providers and results. **Host:** Any. Native: `workbench.view.testing.focus`.  |
| Output | `positronDeck.openOutput`<br>`ctrl+alt+shift+f1 f` | Show or hide the Output panel. **Host:** Any. Native: `workbench.action.output.toggleOutput`.  |
| Settings | `positronDeck.openSettings`<br>`ctrl+alt+shift+f1 g` | Open the graphical settings editor. **Host:** Any. Native: `workbench.action.openSettings`.  |
| Keyboard Shortcuts | `positronDeck.openKeybindings`<br>`ctrl+alt+shift+f1 h` | Inspect or change keyboard shortcuts. **Host:** Any. Native: `workbench.action.openGlobalKeybindings`.  |
| Quick Open File | `positronDeck.quickOpen`<br>`ctrl+alt+shift+f1 i` | Find a file by name. **Host:** Any. Native: `workbench.action.quickOpen`.  |
| Symbols in File | `positronDeck.goToSymbol`<br>`ctrl+alt+shift+f1 j` | Jump to a function or symbol in the active file. **Host:** Any. Native: `workbench.action.gotoSymbol`.  |
| Go to Line | `positronDeck.goToLine`<br>`ctrl+alt+shift+f1 k` | Jump to a line number. **Host:** Any. Native: `workbench.action.gotoLine`.  |
| Focus Editor | `positronDeck.focusEditor`<br>`ctrl+alt+shift+f1 l` | Return keyboard focus to the active editor group. **Host:** Any. Native: `workbench.action.focusActiveEditorGroup`.  |
| Next Editor | `positronDeck.nextEditor`<br>`ctrl+alt+shift+f1 m` | Switch to the next open editor. **Host:** Any. Native: `workbench.action.nextEditor`.  |
| Previous Editor | `positronDeck.previousEditor`<br>`ctrl+alt+shift+f1 n` | Switch to the previous open editor. **Host:** Any. Native: `workbench.action.previousEditor`.  |
| Navigate Back | `positronDeck.navigateBack`<br>`ctrl+alt+shift+f1 o` | Return to the previous code location. **Host:** Any. Native: `workbench.action.navigateBack`.  |
| Navigate Forward | `positronDeck.navigateForward`<br>`ctrl+alt+shift+f1 p` | Move forward in navigation history. **Host:** Any. Native: `workbench.action.navigateForward`.  |
| Reopen Closed Editor | `positronDeck.reopenEditor`<br>`ctrl+alt+shift+f1 q` | Reopen the most recently closed editor. **Host:** Any. Native: `workbench.action.reopenClosedEditor`.  |
| Recent Projects | `positronDeck.openRecent`<br>`ctrl+alt+shift+f1 r` | Open a recently used project or workspace. **Host:** Any. Native: `workbench.action.openRecent`.  |
| Data Connections | `positronDeck.openDataConnections`<br>`ctrl+alt+shift+f1 s` | Open the new Data Connections activity-bar view when available. **Host:** Positron. Native: `workbench.panel.positronDataConnections`.  |
| Connections | `positronDeck.openConnections`<br>`ctrl+alt+shift+f1 t` | Open the classic Connections pane. **Host:** Positron. Native: `workbench.panel.positronConnections`.  |
| Variables | `positronDeck.openVariables`<br>`ctrl+alt+shift+f1 u` | Focus in-memory objects in the Variables pane. **Host:** Positron. Native: `positronVariables.focus`.  |
| Plots | `positronDeck.openPlots`<br>`ctrl+alt+shift+f1 v` | Focus the plots history pane. **Host:** Positron. Native: `workbench.panel.positronPlots.focus`.  |
| Help Pane | `positronDeck.openHelp`<br>`ctrl+alt+shift+f1 w` | Focus language help. **Host:** Positron. Native: `workbench.panel.positronHelp.focus`.  |
| Console History | `positronDeck.openHistory`<br>`ctrl+alt+shift+f1 x` | Open console execution history. **Host:** Positron. Native: `workbench.panel.positronHistory`.  |
| Viewer | `positronDeck.openViewer`<br>`ctrl+alt+shift+f1 y` | Open application and HTML previews. **Host:** Positron. Native: `workbench.panel.positronPreview`.  |
| Packages | `positronDeck.openPackages`<br>`ctrl+alt+shift+f1 z` | Open the optional Packages pane. **Host:** Positron. Native: `workbench.action.positron.openPackages`.  |
| Runtime Sessions | `positronDeck.openSessions`<br>`ctrl+alt+shift+f1 0` | Open the optional Runtime Sessions view. **Host:** Positron. Native: `workbench.panel.positronSessions`.  |
| Assistant Chat | `positronDeck.openAssistant`<br>`ctrl+alt+shift+f1 1` | Open the installed chat assistant. Provider configuration may be required. **Host:** Any. Native: `workbench.action.chat.open`.  |

## editor

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Save File | `positronDeck.saveFile`<br>`ctrl+alt+shift+f1 2` | Save the active editor. **Host:** Any. Native: `workbench.action.files.save`.  |
| Save All | `positronDeck.saveAll`<br>`ctrl+alt+shift+f1 3` | Save all dirty files. **Host:** Any. Native: `workbench.action.files.saveAll`.  |
| New Untitled File | `positronDeck.newFile`<br>`ctrl+alt+shift+f1 4` | Create a blank file. **Host:** Any. Native: `workbench.action.files.newUntitledFile`.  |
| Close Editor | `positronDeck.closeEditor`<br>`ctrl+alt+shift+f1 5` | Close the editor with the host's save prompts. **Host:** Any. Native: `workbench.action.closeActiveEditor`.  |
| Find in File | `positronDeck.findInFile`<br>`ctrl+alt+shift+f1 6` | Find text in the active editor. **Host:** Any. Native: `actions.find`.  |
| Replace in File | `positronDeck.replaceInFile`<br>`ctrl+alt+shift+f1 7` | Open find and replace in the current file. **Host:** Any. Native: `editor.action.startFindReplaceAction`.  |
| Toggle Line Comment | `positronDeck.commentLine`<br>`ctrl+alt+shift+f1 8` | Comment or uncomment the selected lines. **Host:** Any. Native: `editor.action.commentLine`.  |
| Toggle Block Comment | `positronDeck.commentBlock`<br>`ctrl+alt+shift+f1 9` | Wrap or unwrap a block comment. **Host:** Any. Native: `editor.action.blockComment`.  |
| Duplicate Line Down | `positronDeck.duplicateLine`<br>`ctrl+alt+shift+f2 a` | Copy the current line or selection below. **Host:** Any. Native: `editor.action.copyLinesDownAction`.  |
| Move Line Up | `positronDeck.moveLineUp`<br>`ctrl+alt+shift+f2 b` | Move selected lines one position up. **Host:** Any. Native: `editor.action.moveLinesUpAction`.  |
| Move Line Down | `positronDeck.moveLineDown`<br>`ctrl+alt+shift+f2 c` | Move selected lines one position down. **Host:** Any. Native: `editor.action.moveLinesDownAction`.  |
| Select Next Match | `positronDeck.selectNextMatch`<br>`ctrl+alt+shift+f2 d` | Add the next matching word to a multi-cursor selection. **Host:** Any. Native: `editor.action.addSelectionToNextFindMatch`.  |
| Select All Matches | `positronDeck.selectAllMatches`<br>`ctrl+alt+shift+f2 e` | Select matching occurrences throughout the file. **Host:** Any. Native: `editor.action.selectHighlights`.  |
| Expand Selection | `positronDeck.expandSelection`<br>`ctrl+alt+shift+f2 f` | Expand selection by syntax boundaries. **Host:** Any. Native: `editor.action.smartSelect.expand`.  |
| Shrink Selection | `positronDeck.shrinkSelection`<br>`ctrl+alt+shift+f2 g` | Shrink a previously expanded selection. **Host:** Any. Native: `editor.action.smartSelect.shrink`.  |
| Rename Symbol | `positronDeck.renameSymbol`<br>`ctrl+alt+shift+f2 h` | Rename a symbol using the language server. **Host:** Any. Native: `editor.action.rename`.  |
| Quick Fix | `positronDeck.quickFix`<br>`ctrl+alt+shift+f2 i` | Show code actions and fixes at the cursor. **Host:** Any. Native: `editor.action.quickFix`.  |
| Go to Definition | `positronDeck.goToDefinition`<br>`ctrl+alt+shift+f2 j` | Navigate to a symbol definition. **Host:** Any. Native: `editor.action.revealDefinition`.  |
| Peek Definition | `positronDeck.peekDefinition`<br>`ctrl+alt+shift+f2 k` | Inspect a definition without leaving the file. **Host:** Any. Native: `editor.action.peekDefinition`.  |
| Find References | `positronDeck.findReferences`<br>`ctrl+alt+shift+f2 l` | Find references using the language server. **Host:** Any. Native: `editor.action.referenceSearch.trigger`.  |
| Format Selection | `positronDeck.formatSelection`<br>`ctrl+alt+shift+f2 m` | Format selected code using the installed formatter. **Host:** Any. Native: `editor.action.formatSelection`.  |
| Fold All | `positronDeck.foldAll`<br>`ctrl+alt+shift+f2 n` | Collapse foldable regions. **Host:** Any. Native: `editor.foldAll`.  |
| Unfold All | `positronDeck.unfoldAll`<br>`ctrl+alt+shift+f2 o` | Expand all folded regions. **Host:** Any. Native: `editor.unfoldAll`.  |
| Toggle Word Wrap | `positronDeck.toggleWordWrap`<br>`ctrl+alt+shift+f2 p` | Wrap or unwrap long lines visually. **Host:** Any. Native: `editor.action.toggleWordWrap`.  |
| Next Problem | `positronDeck.nextProblem`<br>`ctrl+alt+shift+f2 q` | Navigate to the next diagnostic across files. **Host:** Any. Native: `editor.action.marker.nextInFiles`.  |
| Previous Problem | `positronDeck.previousProblem`<br>`ctrl+alt+shift+f2 r` | Navigate to the previous diagnostic across files. **Host:** Any. Native: `editor.action.marker.prevInFiles`.  |
| Undo | `positronDeck.undo`<br>`ctrl+alt+shift+f2 s` | Undo the most recent editor change. **Host:** Any. Native: `undo`.  |
| Redo | `positronDeck.redo`<br>`ctrl+alt+shift+f2 t` | Redo the most recently undone change. **Host:** Any. Native: `redo`.  |

## data

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| View Data at Cursor | `positronDeck.viewDataAtCursor`<br>`ctrl+alt+shift+f2 1` | Open the dataframe named at the cursor in Data Explorer. **Host:** Positron. Native: `workbench.action.positronDataExplorer.viewDataFrameAtCursor`.  |
| Choose Dataframe | `positronDeck.viewDataVariable`<br>`ctrl+alt+shift+f2 2` | Choose a runtime dataframe to inspect. **Host:** Positron. Native: `workbench.action.positronDataExplorer.viewDataFrameByVariable`.  |
| Refresh Variables | `positronDeck.refreshVariables`<br>`ctrl+alt+shift+f2 3` | Refresh the Variables pane from the runtime. **Host:** Positron. Native: `workbench.action.positronVariables.refresh`.  |
| Refresh Packages | `positronDeck.refreshPackages`<br>`ctrl+alt+shift+f2 4` | Refresh the optional package inventory. **Host:** Positron. Native: `positronPackages.refreshPackages`.  |
| Import Data from File | `positronDeck.importData`<br>`ctrl+alt+shift+f2 5` | Open the native file importer when supported by this Positron version. **Host:** Positron. Native: `workbench.action.positronDataExplorer.importDataFromFile`.  |
| Copy Data Selection | `positronDeck.dataCopy`<br>`ctrl+alt+shift+f2 6` | Copy selected cells from the active Data Explorer. **Host:** Positron. Native: `workbench.action.positronDataExplorer.copy`.  |
| Expand Data Summary | `positronDeck.dataSummaryExpand`<br>`ctrl+alt+shift+f2 7` | Show the summary sidebar in the active Data Explorer. **Host:** Positron. Native: `workbench.action.positronDataExplorer.expandSummary`.  |
| Collapse Data Summary | `positronDeck.dataSummaryCollapse`<br>`ctrl+alt+shift+f2 8` | Hide the summary sidebar in the active Data Explorer. **Host:** Positron. Native: `workbench.action.positronDataExplorer.collapseSummary`.  |
| Clear Data Sorting | `positronDeck.dataClearSorting`<br>`ctrl+alt+shift+f2 9` | Clear the active Data Explorer column sort order. **Host:** Positron. Native: `workbench.action.positronDataExplorer.clearColumnSorting`.  |
| Data Filters to Code | `positronDeck.dataToCode`<br>`ctrl+alt+shift+f3 a` | Open the native dialog for turning data exploration into reproducible code when available. **Host:** Positron. Native: `workbench.action.positronDataExplorer.convertToCodeModal`.  |
| Next Plot | `positronDeck.plotNext`<br>`ctrl+alt+shift+f3 b` | Navigate to the next plot in history. **Host:** Positron. Native: `workbench.action.positronPlots.next`.  |
| Previous Plot | `positronDeck.plotPrevious`<br>`ctrl+alt+shift+f3 c` | Navigate to the previous plot in history. **Host:** Positron. Native: `workbench.action.positronPlots.previous`.  |
| Save Plot | `positronDeck.plotSave`<br>`ctrl+alt+shift+f3 d` | Open the native plot save/export dialog. **Host:** Positron. Native: `workbench.action.positronPlots.save`.  |
| Copy Plot | `positronDeck.plotCopy`<br>`ctrl+alt+shift+f3 e` | Copy a plot using Positron's chooser. **Host:** Positron. Native: `workbench.action.positronPlots.copy`.  |
| Plot in Editor | `positronDeck.plotEditor`<br>`ctrl+alt+shift+f3 f` | Open a plot in a dedicated editor. **Host:** Positron. Native: `workbench.action.positronPlots.openEditor`.  |
| Pop Out Plot | `positronDeck.plotPopout`<br>`ctrl+alt+shift+f3 g` | Open a plot in its own window where supported. **Host:** Positron. Native: `workbench.action.positronPlots.popout`.  |
| Plot Size Policy | `positronDeck.plotSizing`<br>`ctrl+alt+shift+f3 h` | Choose a plot sizing policy. **Host:** Positron. Native: `workbench.action.positronPlots.sizingPolicy`.  |

## layout

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Toggle Primary Sidebar | `positronDeck.toggleSidebar`<br>`ctrl+alt+shift+f3 i` | Show or hide the primary sidebar. **Host:** Any. Native: `workbench.action.toggleSidebarVisibility`.  |
| Toggle Secondary Sidebar | `positronDeck.toggleSecondarySidebar`<br>`ctrl+alt+shift+f3 j` | Show or hide the secondary sidebar. **Host:** Any. Native: `workbench.action.toggleAuxiliaryBar`.  |
| Toggle Panel | `positronDeck.togglePanel`<br>`ctrl+alt+shift+f3 k` | Show or hide the bottom panel. **Host:** Any. Native: `workbench.action.togglePanel`.  |
| Maximize Panel | `positronDeck.maximizePanel`<br>`ctrl+alt+shift+f3 l` | Toggle a maximized panel. **Host:** Any. Native: `workbench.action.toggleMaximizedPanel`.  |
| Zen Mode | `positronDeck.zenMode`<br>`ctrl+alt+shift+f3 m` | Toggle distraction-free editing. **Host:** Any. Native: `workbench.action.toggleZenMode`.  |
| Full Screen | `positronDeck.fullScreen`<br>`ctrl+alt+shift+f3 n` | Toggle full screen where allowed by the host. **Host:** Any. Native: `workbench.action.toggleFullScreen`.  |
| Customize Layout | `positronDeck.customizeLayout`<br>`ctrl+alt+shift+f3 o` | Open the layout customization menu. **Host:** Any. Native: `workbench.action.customizeLayout`.  |
| Split Editor Right | `positronDeck.splitEditorRight`<br>`ctrl+alt+shift+f3 p` | Split the active editor to the right. **Host:** Any. Native: `workbench.action.splitEditorRight`.  |
| Split Editor Down | `positronDeck.splitEditorDown`<br>`ctrl+alt+shift+f3 q` | Split the active editor below. **Host:** Any. Native: `workbench.action.splitEditorDown`.  |
| Single Editor | `positronDeck.layoutSingle`<br>`ctrl+alt+shift+f3 r` | Use a single editor group. **Host:** Any. Native: `workbench.action.editorLayoutSingle`.  |
| Two Editor Columns | `positronDeck.layoutColumns`<br>`ctrl+alt+shift+f3 s` | Arrange two editor columns. **Host:** Any. Native: `workbench.action.editorLayoutTwoColumns`.  |
| Two Editor Rows | `positronDeck.layoutRows`<br>`ctrl+alt+shift+f3 t` | Arrange two editor rows. **Host:** Any. Native: `workbench.action.editorLayoutTwoRows`.  |
| Editor Grid | `positronDeck.layoutGrid`<br>`ctrl+alt+shift+f3 u` | Arrange a two-by-two editor grid. **Host:** Any. Native: `workbench.action.editorLayoutTwoByTwoGrid`.  |
| Next Editor Group | `positronDeck.focusNextGroup`<br>`ctrl+alt+shift+f3 v` | Focus the next editor group. **Host:** Any. Native: `workbench.action.focusNextGroup`.  |
| Move Editor Right | `positronDeck.moveEditorRight`<br>`ctrl+alt+shift+f3 w` | Move the current editor to the right group. **Host:** Any. Native: `workbench.action.moveEditorToRightGroup`.  |
| Zoom In | `positronDeck.zoomIn`<br>`ctrl+alt+shift+f3 x` | Increase interface scale where supported. **Host:** Any. Native: `workbench.action.zoomIn`.  |
| Zoom Out | `positronDeck.zoomOut`<br>`ctrl+alt+shift+f3 y` | Decrease interface scale where supported. **Host:** Any. Native: `workbench.action.zoomOut`.  |
| Reset Zoom | `positronDeck.zoomReset`<br>`ctrl+alt+shift+f3 z` | Reset interface scale. **Host:** Any. Native: `workbench.action.zoomReset`.  |
| Reset View Locations | `positronDeck.resetViewLocations`<br>`ctrl+alt+shift+f3 0` | Restore moved views to their default locations. **Host:** Any. Native: `workbench.action.resetViewLocations`. Confirmation required. |
| Stacked Data Science | `positronDeck.layoutStacked`<br>`ctrl+alt+shift+f3 1` | Apply Positron's stacked data-science layout. **Host:** Positron. Native: `workbench.action.positronFourPaneDataScienceLayout`.  |
| Side-by-side Data Science | `positronDeck.layoutSideBySide`<br>`ctrl+alt+shift+f3 2` | Apply Positron's wide-screen data-science layout. **Host:** Positron. Native: `workbench.action.positronTwoPaneDataScienceLayout`.  |
| Notebook Layout | `positronDeck.layoutNotebook`<br>`ctrl+alt+shift+f3 3` | Apply Positron's notebook-focused layout. **Host:** Positron. Native: `workbench.action.positronNotebookLayout`.  |
| Assistant Layout | `positronDeck.layoutAssistant`<br>`ctrl+alt+shift+f3 4` | Arrange the workspace around Assistant, editor and console. **Host:** Positron. Native: `workbench.action.positronAssistantLayout`.  |
| Help beside Console | `positronDeck.layoutHelp`<br>`ctrl+alt+shift+f3 5` | Dock Help alongside the Console. **Host:** Positron. Native: `workbench.action.positronHelpPaneDocked`.  |
| Full-size Panel | `positronDeck.maximizeConsoleArea`<br>`ctrl+alt+shift+f3 6` | Apply Positron's full-sized panel layout. **Host:** Positron. Native: `workbench.action.fullSizedPanel`.  |
| Full-size Data Sidebar | `positronDeck.maximizeDataArea`<br>`ctrl+alt+shift+f3 7` | Apply Positron's full-sized secondary sidebar layout. **Host:** Positron. Native: `workbench.action.fullSizedAuxiliaryBar`.  |

## terminal

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| New Terminal | `positronDeck.newTerminal`<br>`ctrl+alt+shift+f4 e` | Create a terminal in the workspace. **Host:** Any. Native: `workbench.action.terminal.new`.  |
| Split Terminal | `positronDeck.splitTerminal`<br>`ctrl+alt+shift+f4 f` | Split the current terminal. **Host:** Any. Native: `workbench.action.terminal.split`.  |
| Clear Terminal | `positronDeck.clearTerminal`<br>`ctrl+alt+shift+f4 g` | Clear the terminal display. **Host:** Any. Native: `workbench.action.terminal.clear`.  |
| Next Terminal | `positronDeck.nextTerminal`<br>`ctrl+alt+shift+f4 h` | Focus the next terminal. **Host:** Any. Native: `workbench.action.terminal.focusNext`.  |
| Previous Terminal | `positronDeck.previousTerminal`<br>`ctrl+alt+shift+f4 i` | Focus the previous terminal. **Host:** Any. Native: `workbench.action.terminal.focusPrevious`.  |
| Run Task | `positronDeck.runTask`<br>`ctrl+alt+shift+f4 j` | Choose a configured VS Code task. **Host:** Any. Native: `workbench.action.tasks.runTask`.  |
| Run Build Task | `positronDeck.runBuildTask`<br>`ctrl+alt+shift+f4 k` | Run or select the configured build task. **Host:** Any. Native: `workbench.action.tasks.build`.  |

## debug

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Start Debugging | `positronDeck.debugStart`<br>`ctrl+alt+shift+f4 l` | Start debugging using the active launch configuration. **Host:** Any. Native: `workbench.action.debug.start`.  |
| Stop Debugging | `positronDeck.debugStop`<br>`ctrl+alt+shift+f4 m` | Stop the active debug session. **Host:** Any. Native: `workbench.action.debug.stop`.  |
| Debug: Continue | `positronDeck.debugContinue`<br>`ctrl+alt+shift+f4 n` | Continue a paused debug session. **Host:** Any. Native: `workbench.action.debug.continue`.  |
| Debug: Step Over | `positronDeck.debugStepOver`<br>`ctrl+alt+shift+f4 o` | Execute the current statement without stepping into functions. **Host:** Any. Native: `workbench.action.debug.stepOver`.  |
| Debug: Step Into | `positronDeck.debugStepInto`<br>`ctrl+alt+shift+f4 p` | Step into the next function call. **Host:** Any. Native: `workbench.action.debug.stepInto`.  |
| Debug: Step Out | `positronDeck.debugStepOut`<br>`ctrl+alt+shift+f4 q` | Continue until the current function returns. **Host:** Any. Native: `workbench.action.debug.stepOut`.  |
| Toggle Breakpoint | `positronDeck.toggleBreakpoint`<br>`ctrl+alt+shift+f4 r` | Toggle a breakpoint at the current line. **Host:** Any. Native: `editor.debug.action.toggleBreakpoint`.  |

## notebook

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Notebook: Run Cell | `positronDeck.notebookRunCell`<br>`ctrl+alt+shift+f4 s` | Run the active code cell or edit the active Markdown cell in Positron's notebook editor. **Host:** Positron. Native: `positronNotebook.cell.executeOrToggleEditor`.  |
| Notebook: Run and Next | `positronDeck.notebookRunNext`<br>`ctrl+alt+shift+f4 t` | Execute the active notebook cell and select the next. **Host:** Positron. Native: `positronNotebook.cell.executeAndSelectBelow`.  |
| Notebook: Run All | `positronDeck.notebookRunAll`<br>`ctrl+alt+shift+f4 u` | Run every cell in the active Positron notebook. **Host:** Positron. Native: `positronNotebook.runAllCells`.  |
| Notebook: Run Above | `positronDeck.notebookRunAbove`<br>`ctrl+alt+shift+f4 v` | Run cells above the active notebook cell. **Host:** Positron. Native: `positronNotebook.cell.runAllAbove`.  |
| Notebook: Run Below | `positronDeck.notebookRunBelow`<br>`ctrl+alt+shift+f4 w` | Run cells below the active notebook cell. **Host:** Positron. Native: `positronNotebook.cell.runAllBelow`.  |
| Notebook: Insert Code | `positronDeck.notebookInsertCode`<br>`ctrl+alt+shift+f4 x` | Insert a code cell below the current notebook cell. **Host:** Positron. Native: `positronNotebook.cell.insertCodeCellBelowAndFocusContainer`.  |
| Notebook: Insert Markdown | `positronDeck.notebookInsertMarkdown`<br>`ctrl+alt+shift+f4 y` | Insert a Markdown cell below the current cell. **Host:** Positron. Native: `positronNotebook.cell.insertMarkdownCellBelowAndFocusContainer`.  |
| Notebook: Clear Outputs | `positronDeck.notebookClearOutputs`<br>`ctrl+alt+shift+f4 z` | Clear all notebook outputs. **Host:** Positron. Native: `positronNotebook.clearAllOutputs`. Confirmation required. |
| Notebook: Stop All | `positronDeck.notebookStop`<br>`ctrl+alt+shift+f4 0` | Stop execution in the active notebook. **Host:** Positron. Native: `positronNotebook.stopAllCells`.  |

## workflow

| Action | Command / hotkey | Behavior and requirement |
|---|---|---|
| Save and Run | `positronDeck.saveAndRun`<br>`ctrl+alt+shift+f4 1` | Save the active file, then execute it. Stop if saving is cancelled. **Host:** Provider.   |
| Format and Save | `positronDeck.formatAndSave`<br>`ctrl+alt+shift+f4 2` | Run the active formatter, then save the file. Stop on failure. **Host:** Provider.   |
| Save and Test | `positronDeck.saveAndTest`<br>`ctrl+alt+shift+f4 3` | Save all files, then dispatch the project test provider. Inspect results before any deployment. **Host:** Provider.   |
| Review Workspace | `positronDeck.reviewWorkspace`<br>`ctrl+alt+shift+f4 4` | Save all files, open Source Control and reveal Problems for a review pass. **Host:** Provider.   |
| Analysis Workspace | `positronDeck.analysisWorkspace`<br>`ctrl+alt+shift+f4 5` | Apply the stacked layout, reveal Variables and focus the editor. **Host:** Provider.   |
| Quarto Workspace | `positronDeck.quartoWorkspace`<br>`ctrl+alt+shift+f4 6` | Save the document, apply the stacked layout and dispatch Quarto Preview. **Host:** Provider.   |
| Choose Workflow | `positronDeck.runWorkflow`<br>`ctrl+alt+shift+f4 7` | Choose a built-in recipe or a configured workflow. **Host:** Provider.   |
| Check Action Availability | `positronDeck.diagnostics`<br>`ctrl+alt+shift+f4 8` | List supported and missing native commands for this running IDE. **Host:** Provider.   |
| Enable Hotkeys in Terminal | `positronDeck.configureTerminal`<br>`ctrl+alt+shift+f4 9` | Add Deck commands to terminal.integrated.commandsToSkipShell in your user settings after confirmation. **Host:** Provider.   |
| Custom Workflow 1 | `positronDeck.workflowSlot1`<br>`ctrl+alt+shift+f5 a` | Run the workflow assigned to slot 1 in positronDeck.workflowSlots. Configure it once; then use this dedicated button. **Host:** Provider.   |
| Custom Workflow 2 | `positronDeck.workflowSlot2`<br>`ctrl+alt+shift+f5 b` | Run the workflow assigned to slot 2 in positronDeck.workflowSlots. Configure it once; then use this dedicated button. **Host:** Provider.   |
| Custom Workflow 3 | `positronDeck.workflowSlot3`<br>`ctrl+alt+shift+f5 c` | Run the workflow assigned to slot 3 in positronDeck.workflowSlots. Configure it once; then use this dedicated button. **Host:** Provider.   |
| Custom Workflow 4 | `positronDeck.workflowSlot4`<br>`ctrl+alt+shift+f5 d` | Run the workflow assigned to slot 4 in positronDeck.workflowSlots. Configure it once; then use this dedicated button. **Host:** Provider.   |
| Custom Workflow 5 | `positronDeck.workflowSlot5`<br>`ctrl+alt+shift+f5 e` | Run the workflow assigned to slot 5 in positronDeck.workflowSlots. Configure it once; then use this dedicated button. **Host:** Provider.   |
| Custom Workflow 6 | `positronDeck.workflowSlot6`<br>`ctrl+alt+shift+f5 f` | Run the workflow assigned to slot 6 in positronDeck.workflowSlots. Configure it once; then use this dedicated button. **Host:** Provider.   |
| Custom Workflow 7 | `positronDeck.workflowSlot7`<br>`ctrl+alt+shift+f5 g` | Run the workflow assigned to slot 7 in positronDeck.workflowSlots. Configure it once; then use this dedicated button. **Host:** Provider.   |
| Custom Workflow 8 | `positronDeck.workflowSlot8`<br>`ctrl+alt+shift+f5 h` | Run the workflow assigned to slot 8 in positronDeck.workflowSlots. Configure it once; then use this dedicated button. **Host:** Provider.   |

