# Workflow cookbook

## Built-in recipes

| Button | Steps | Completion semantics |
|---|---|---|
| Save and Run | Save active file → Run File | Save completes; runtime execution is dispatched |
| Format and Save | Format Document → save active file | Formatter command is awaited; errors or cancelled save stop the recipe |
| Save and Test | Save all → project test provider | Test dispatch only; check native results |
| Review Workspace | Save all → Source Control → Problems | Opens review surfaces; does not stage or commit |
| Analysis Workspace | Stacked layout → Variables → focus editor | Requires native Positron layout and Variables commands |
| Quarto Workspace | Save active document → Stacked layout → Preview | Preview may continue running |

Recipes execute in the IDE, not as delayed multi-actions on the device. Custom recipes are limited to 32 steps; each step must specify exactly one of `save`, `task` or `command`. Nested workflow commands are rejected. Their eight named slot actions always prompt before executing configured content.

## Test, check, then deploy

Configure finite tasks in `.vscode/tasks.json`. Example for an R package:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Tests",
      "type": "process",
      "command": "Rscript",
      "args": ["-e", "devtools::test(stop_on_failure = TRUE)"],
      "options": { "cwd": "${workspaceFolder}" },
      "problemMatcher": []
    },
    {
      "label": "Check",
      "type": "process",
      "command": "Rscript",
      "args": ["-e", "devtools::check(error_on = 'warning')"],
      "options": { "cwd": "${workspaceFolder}" },
      "problemMatcher": []
    }
  ]
}
```

Use the actual executable from your environment; this example assumes `Rscript` on PATH and installed devtools/testthat. Configure the error policy deliberately. A task returning zero despite failing tests cannot protect a workflow.

In workspace settings:

```json
{
  "positronDeck.workflows": [{
    "name": "Validate and deploy",
    "steps": [
      { "save": "all" },
      { "task": "Tests" },
      { "task": "Check" },
      { "command": "positronDeck.deploy" }
    ]
  }],
  "positronDeck.workflowSlots": ["Validate and deploy"],
  "positronDeck.deploy.provider": "task",
  "positronDeck.deploy.task": "Deploy"
}
```

Define your own `Deploy` task. The extension contains no deployment destination. Drag **Custom Workflow 1** onto a button. Finite task steps wait for process exit zero. A failure, manual termination or unknown exit stops remaining steps. Background tasks are refused. Ambiguous task labels must be made unique, particularly in multi-root workspaces. A hung process can be stopped with the native task controls.

For Python, use a process task such as `python` with arguments `['-m', 'pytest']`, expressed as JSON double-quoted strings, and point `command` to the intended environment. Additional checks can be finite tasks for Ruff, mypy or another tool already installed in the project.

## Interactive analysis loop

1. Press **Analysis Workspace**.
2. Navigate with **Next Code Cell** and execute with **Run Cell and Advance**.
3. Put the cursor on a dataframe and use **View Data at Cursor**.
4. Inspect the summary, clear sorting and, where supported, choose **Data Filters to Code**.
5. Browse plots and choose **Save Plot** to export through the native dialog.

The inspection-to-code step is an intentional reproducibility aid, not a claim that every data exploration action has an equivalent generated script. The native Positron feature determines what can be converted.

## R package iteration

Keep **Load All**, **Document**, **Test**, **Check**, **Lint** and **Style** together. Document and Style ask before changing files. Runtime-based commands can continue asynchronously: use separate button presses during exploration, or finite process tasks for unattended ordering.

## Report and app iteration

**Quarto Workspace** arranges the IDE and starts preview. Use **Render** for a publishable output. **Run App** chooses between detected R Shiny, Python Shiny, Streamlit and FastAPI providers. **Stop App** owns only tasks started by this extension. Avoid blind stop/start chains: task shutdown and server readiness are asynchronous.

## Custom native commands

```json
{
  "name": "Two columns and editor",
  "steps": [
    { "command": "workbench.action.editorLayoutTwoColumns" },
    { "command": "workbench.action.focusActiveEditorGroup" }
  ]
}
```

Native commands may take an `args` array. Only use arguments documented by the owning extension. Command return does not prove external completion. Credential values do not belong in workflow settings.

## Why these recipes?

They combine existing Positron features documented in [Code Cells](https://positron.posit.co/code-cells.html), [Data Explorer](https://positron.posit.co/data-explorer.html) and [Layouts](https://positron.posit.co/layout.html). The combinations are project design proposals to reduce repetitive navigation; no user-frequency research or popularity ranking is claimed.
