---
name: github-issues
description: Drafting, referencing, and creating GitHub issues in this repo - templates, issue-reference style, and the show-before-create rule. Use when drafting or filing any task, bug, feature, or doc-feedback issue, or when referencing issues in issue/PR bodies.
metadata:
  internal: true
---

# GitHub issues

## Use the issue templates

Any task, bug report, feature request, or doc-feedback item - as a file or a
GitHub issue - must follow the matching template in `.github/ISSUE_TEMPLATE/`
(`2.task.yml`, `1.bug_report.yml`, `3.feature_request.yml`,
`4.documentation_feedback.yml`). Read the template first; use its exact section
headings, order, and title prefix (`[Task]`, `[docs]`).

## Issue hierarchy

A task may be a child of a larger issue. When it is, set that issue as the task's
**parent**; for rework discovered later, add a **subtask** whose parent is the task it
reworks.

## Reference issues bare - GitHub renders the title

GitHub auto-renders the title for a bare `#123`, so don't hand-write it.

✗ `- [ ] #136 - [Task] Forward the new React 19 attributes`
✓ `- #136`

## Show before creating

Always show the drafted issue (or file) to the user and wait for explicit
verification before creating it on GitHub or writing the file.

## Mandatory metadata on every created issue

When creating an issue on GitHub, never omit:

- a **label** (the template's own label, e.g. `type: task`) and the issue **type** (Task, Bug, Feature, Docs)
- **assignee** `soroushm`
- a **parent** and a **milestone**, whenever the repo has one that fits
