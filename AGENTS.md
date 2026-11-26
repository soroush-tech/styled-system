# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Behavioral guidelines

### 1. Think before coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.

### 2. Propose before implementing

**Always present a plan and wait for confirmation before writing code.**

Cover: which files change, what changes in each, why. Then wait for explicit approval.

Exception: self-evident one-liners (typo fix, missing import).

### 3. Simplicity first

**Minimum code that solves the problem. Nothing speculative.**

- No features, abstractions, or error handling beyond what was asked.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 4. Surgical changes

**Touch only what you must. Clean up only your own mess.**

- Don't refactor, reformat, or "improve" adjacent code.
- Remove imports/variables/functions that YOUR changes made unused.
- Match existing style.
- If you notice unrelated dead code, mention it - don't delete it.

### 5. Goal-driven execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals: "Fix the bug" → "Write a test that reproduces it, then make it pass."

- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

### 6. Test coverage after implementation

**After any implementation, run `pnpm test:coverage` and verify 100% on all touched files.**

## Critical conventions

- **Package:** `@soroush.tech/styled-system` is a single publishable npm package at the repository root: sources in `src/`, tests co-located as `*.test.ts`, docs in `docs/`, benchmarks in `bench/`, release notes in `release-notes/`. It is public, so it keeps its `LICENSE` file and a `license` field in `package.json`.
- **Coverage:** the package keeps **100% test coverage** (`thresholds: { 100: true }` in `vitest.config.ts`); `pnpm test:coverage` fails below it.
- **SSR guard:** Never import browser-only APIs at module top level - guard with `typeof window !== 'undefined'` or move into effects. This package is consumed by SSR apps.
- **Test placement:** Co-located next to source, as `*.test.ts`, run by vitest.
- **Lint:** `pnpm lint` runs `oxlint --deny-warnings` - any warning fails. Formatting is not
  linted; `oxfmt` owns it, via `pnpm format` and the `format:check` gate in CI.
- **Imports:** no `.ts`/`.tsx`/`.js` extensions in relative import paths (enforced by `plugins/no-import-extensions.js`).
- **Release notes:** every version in `package.json` needs `release-notes/<version>.md` (`pnpm check:release-notes`, run in CI).
- **Issue artifacts:** Any task, bug report, feature request, or documentation-feedback item you draft - whether as a file or for GitHub - must follow the matching template in `.github/ISSUE_TEMPLATE/` (`2.task.yml`, `1.bug_report.yml`, `3.feature_request.yml`, `4.documentation_feedback.yml`). Use that template's exact section headings, order, and title prefix (e.g. `[Task]`). Read the template before drafting.

## Quick checklist before pushing

1. `pnpm lint`
2. `pnpm format:check`
3. `pnpm typecheck`
4. `pnpm test:coverage` - verify 100% on all touched files
5. `pnpm build`
6. `pnpm check:release-notes`

## Releasing

See [RELEASING.md](./RELEASING.md): releases are a manual `CD` workflow dispatch (alpha, rc, stable). The `commit`, `release-notes`, `prerelease` and other project skills live in `.claude/skills/`.
