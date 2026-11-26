---
name: testing
description: How this repo runs tests and coverage - test placement, the vitest commands, where coverage output lands (coverage/lcov.info), and how 100% is enforced. Use when running tests or coverage, checking per-file coverage, or verifying 100% on touched files.
metadata:
  internal: true
---

## Tests

Co-located next to source as `*.test.ts`, run by vitest (`vitest.config.ts`). One flat config, no
projects. Scripts under `scripts/` are tested and covered the same way (`scripts/*.test.ts`).
`vitest.global.ts` is a global setup that runs once before the suites.

## Commands

| Command              | Runs                                              |
| -------------------- | ------------------------------------------------- |
| `pnpm test`          | the whole suite                                   |
| `pnpm test:coverage` | the suite with coverage - **CI's run**            |
| `pnpm bench`         | the benchmark in `bench/` (not part of the tests) |

Scope a run with a path filter: `pnpm exec vitest run src/space`.

## Where coverage output lands

`coverage/` at the repo root (reporters: `text` + `lcov`; gitignored):

- `coverage/lcov.info` - the file CI uploads to Codecov (tokenless, OIDC).
- The `text` reporter prints the summary to stdout - no file.

Coverage covers `src/**` and `scripts/**/*.mjs`.

## The 100% gate

**The package must hold 100% coverage** (AGENTS.md guideline 6). It is enforced where the tests
run: `vitest.config.ts` sets coverage `thresholds: { 100: true }`, so `pnpm test:coverage` exits
non-zero below 100% - CI inherits the gate from that. Codecov is reporting only. No
v8/c8/istanbul ignore pragmas - reach 100% with real tests or by removing dead code.
