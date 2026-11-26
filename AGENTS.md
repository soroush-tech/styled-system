# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

`@soroush.tech/styled-system` is a single npm package at the repository root: sources in `src/`, tests co-located as `*.test.ts`, docs in `docs/`, benchmarks in `bench/`.

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

### 4. Surgical changes

**Touch only what you must. Clean up only your own mess.**

- Don't refactor, reformat, or "improve" adjacent code.
- Remove imports/variables/functions that YOUR changes made unused.
- Match existing style.
- If you notice unrelated dead code, mention it - don't delete it.

### 5. Goal-driven execution

**Define success criteria. Loop until verified.**

- "Fix the bug" -> write a test that reproduces it, then make it pass.
- "Refactor X" -> ensure tests pass before and after.

### 6. Test coverage after implementation

**After any implementation, run `pnpm test:coverage` and verify 100% on all touched files.**

## Conventions

- **Coverage:** the package keeps 100% test coverage (`thresholds: { 100: true }`).
- **Lint:** `pnpm lint` runs `oxlint --deny-warnings` - any warning fails. Formatting is not linted; `oxfmt` owns it, via `pnpm format` and the `format:check` gate.
- **Imports:** no `.ts`/`.tsx`/`.js` extensions in relative import paths (enforced by `plugins/no-import-extensions.js`).
- **SSR guard:** never touch browser-only APIs at module top level.

## Quick checklist before pushing

1. `pnpm lint`
2. `pnpm format:check`
3. `pnpm typecheck`
4. `pnpm test:coverage` - verify 100%
5. `pnpm build`
