Create a GitHub task issue draft in markdown format based on the context provided.

The task topic or description is: $ARGUMENTS

---

## Step 1 - Gather context

Build context:

Read `.github/ISSUE_TEMPLATE/2.task.yml` so you know the exact field labels.

If `$ARGUMENTS` is empty, infer the task title and domain from the branch name and recent commit messages.

---

## Step 2 - Draft the issue

Using the gathered context, write a complete task issue in GitHub Markdown. Follow the structure below exactly - use the same section headings as the template (`Task Description ✏️`, `Acceptance Criteria ✅`, etc.).

Guidelines for each section:

**Title** - action-oriented, starts with a verb, e.g. "Forward the new React 19 attributes" or "Migrate API auth to JWT". Prepend `[Task]` internally but do NOT include it in the `## Title` line of the output.

**Task Description ✏️**

- 2-4 sentences: what is being built/changed, why it matters, which parent issue it belongs to, if any (reference the issue number if inferable from context).
- Be concrete - mention the component, module, or area being touched.

**Acceptance Criteria ✅**

- One checkbox per verifiable condition.
- Cover: implementation, API, edge cases, tests (100% coverage), lint/types/CI.
- Each item should be independently testable.

**Dependencies 🔗**

- List blocking issues/PRs by number or name, or write `_No response_` if none.

**Definition of Ready (DoR) 📋**

- Bullet list of what must be true before work starts (approach agreed, tokens available, API contract stable, etc.).

**Definition of Done (DoD) 🏁**

- Checkbox list mirroring Acceptance Criteria at a higher level: change working, tests green with 100% coverage, code reviewed, docs and release notes updated, CI passing.

**Additional Notes or Resources 📎**

- Relevant MDN links, design references, prior art in the codebase, or usage examples.
- If nothing applies, write `_No response_`.

---

## Step 3 - Output the draft

Print the full issue content to the conversation in a single markdown code block so the user can copy and paste it directly into GitHub's new-issue form under the **Task 🛠️** template.

Do not write any files.
