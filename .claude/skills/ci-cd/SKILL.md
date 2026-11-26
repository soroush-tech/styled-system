---
name: ci-cd
description: GitHub Actions CI/CD conventions for this repo - the single CI entry workflow (lint, test, build, bench, ci-ok), the action-pinning rule (version tags for `actions/*`, commit SHAs for everything else including our own org), tokenless-OIDC Codecov uploads, and manual npm publishing via cd-packages.yml. Use when adding, editing, or debugging any workflow under .github/workflows/.
paths: .github/workflows/**
metadata:
  internal: true
---

# CI/CD (GitHub Actions)

## Workflow files

| File              | Name                  | Trigger                              |
| ----------------- | --------------------- | ------------------------------------ |
| `ci.yml`          | `CI`                  | `push` to `main`, all `pull_request` |
| `cd-packages.yml` | `CD · Packages (npm)` | manual `workflow_dispatch` only      |

One CI entry workflow holding every job; CD is separate and **manual only** - a release is a
deliberate act with required, human-written notes, never triggered by a push or merge.

## Action pinning convention - the load-bearing rule

Pin every `uses:` by the action's **origin**:

- **GitHub's own** - `actions/*` (checkout, setup-node, cache, github-script) → **version tag**:
  `actions/checkout@v7`.
- **Everything else, our own org included** (`soroush-tech/bench-action`, `pnpm/action-setup`,
  `codecov/codecov-action`) → **commit SHA** + `# vX` comment. What SHA-pinning defends against
  is a tag being moved, and our own tags move like anyone's. The SHA is bumped when the action
  releases - the upgrade is a reviewed line, not a silent one.

## CI job shape

`lint`, `test`, `build` and `bench` (after `lint`) → `ci-ok`.

- `lint` runs `pnpm lint`, `pnpm format:check`, `pnpm typecheck` and `pnpm check:release-notes`;
  `test` runs `pnpm test:coverage`; `build` runs `pnpm build`.
- **Every job that installs starts from `./.github/actions/setup`** - the composite action
  holding pnpm, Node (from `.nvmrc`) and the install. **Never re-inline those steps**: the
  `pnpm/action-setup` pin stays a one-file edit. A new job is a checkout (the action cannot carry
  it - a local action is resolved from the working tree it checks out) plus a call to the action.
  Never hard-code the node version.
- Every install runs `--ignore-scripts`: no lifecycle script at install time, anywhere in CI -
  the package builds with tsdown, which needs none.
- **`bench`** is the performance gate: builds the package, then `soroush-tech/bench-action`
  compares `bench/` against the last npm release; a case below the minimum speed ratio fails the
  PR via ci-ok. The bot-token mint step is optional - without the `BENCH_BOT_APP_ID` var it
  falls back to `GITHUB_TOKEN`.
- **`ci-ok`** is the single branch-protection check: `if: always()`, fails only on a needed
  job's `failure`/`cancelled`. **Add every new job to its `needs`.**
- Set `timeout-minutes` on every job. CI concurrency cancels superseded runs; CD does not
  (`cancel-in-progress: false`).

## Coverage → Codecov

- The `test` job uploads `coverage/lcov.info`.
- Uploads are **tokenless via OIDC** (`use_oidc: true` + job `permissions: { id-token: write }`,
  works on this public repo) - no `CODECOV_TOKEN` secret.
- 100% is enforced in `vitest.config.ts` (`thresholds: { 100: true }`); Codecov is reporting
  only (`.codecov.yml`).

## Publishing (cd-packages.yml)

Manual dispatch with a `channel` input (`alpha` | `rc` | `stable` - see the `prerelease` skill):
`alpha` runs from any branch whose `ci-ok` passed and publishes `<target>-alpha.N` under the
`alpha` dist-tag; `rc` and `stable` run from `main` only. `scripts/prerelease-versions.mjs`
computes the version in the checkout. npm **Trusted Publishing** (OIDC id-token per run, no
NPM_TOKEN; `NODE_AUTH_TOKEN` must stay unset). Requires the `cd-packages` environment and the
npm trusted-publisher config for this repo (see `RELEASING.md`). Notes come from
`release-notes/<version>.md` - the run refuses to publish without the file, and the same guard
runs earlier in `lint` (`pnpm check:release-notes`). A version already on the registry is
skipped. The GitHub Release step is idempotent and re-runnable (see the `release-notes` skill).
