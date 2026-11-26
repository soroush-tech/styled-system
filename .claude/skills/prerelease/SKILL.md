---
name: prerelease
description: How to ship @soroush.tech/styled-system through alpha -> rc -> stable on npm with the `channel` dropdown of CD · Packages, so a change is tried in a real app before it reaches `latest`. Use when releasing, publishing an alpha or release candidate from a branch, promoting to stable, or pointing a consumer app at a prerelease.
metadata:
  internal: true
---

# Prerelease channel: alpha -> rc -> stable

A release that changes behaviour or API goes alpha -> rc -> stable. Only a maintenance or
docs-only PATCH may go straight to stable.

`package.json` always holds the **target** version (`2.0.0`) - never a prerelease. The
**CD · Packages (npm)** dispatch (`.github/workflows/cd-packages.yml`) has a `channel` dropdown,
and the workflow (`scripts/prerelease-versions.mjs`) turns the target into the published version
in its own checkout:

| channel  | Published as    | npm dist-tag | Run from                        | GitHub Release |
| -------- | --------------- | ------------ | ------------------------------- | -------------- |
| `alpha`  | `X.Y.Z-alpha.N` | `alpha`      | any branch whose `ci-ok` passed | none           |
| `rc`     | `X.Y.Z-rc.N`    | `rc`         | `main`                          | pre-release    |
| `stable` | `X.Y.Z`         | `latest`     | `main`                          | release        |

`N` is one above the highest `X.Y.Z-<channel>.N` already on npm, `0` when there is none -
nobody edits it.

## Rules

- Pick the target by the semver rule in the [`release-notes`](../release-notes/SKILL.md) skill
  and bump `package.json` to it once, before the first alpha. It stays there through every alpha
  and rc.

  ```jsonc
  // ✗ a prerelease in package.json - the workflow refuses it
  "version": "2.0.0-alpha.1"
  // ✓ the target; the dispatch adds the suffix
  "version": "2.0.0"
  ```

- One notes file per target: `release-notes/X.Y.Z.md` - never one per alpha or rc. It must exist
  from the first alpha (the workflow checks the target's file on every channel), and it grows as
  the alphas go: update it with each change rather than adding a file. An rc's GitHub
  pre-release shows it, so it is complete before the first rc.
- A prerelease never lands on `latest` - the workflow publishes with `--tag <channel>` and fails
  the run if `latest` ever points at a prerelease. That is also why the
  `check:release-notes` gate keeps passing: it compares `package.json` with its notes file only.
- A target already released can't get a prerelease: bump the version first.
- Consumers never get a prerelease by accident: `^1.3.4`, `^2.0.0` and `@latest` skip
  prereleases. An app opts in by tag or exact version.

## Publish an alpha (test a PR before it merges)

1. Bump `package.json` to the target on the feature branch (once), commit; the user pushes and
   opens the PR.
2. Wait for CI: `ci-ok` must be green on the branch's latest commit.
3. The user dispatches **CD · Packages (npm)**: _Use workflow from_ the branch, `channel: alpha`.
4. In the consumer app: `pnpm add @soroush.tech/styled-system@alpha`, then test there.
5. Something wrong: fix, push, wait for green CI, dispatch again - the next `alpha.N` follows.

## Publish a release candidate

1. Merge the PR (the target and `release-notes/X.Y.Z.md` in it).
2. Dispatch from `main` with `channel: rc`.
3. Consumers: `pnpm add @soroush.tech/styled-system@rc`. A fix is a PR to `main`, then another `rc`.

## Promote to stable

1. Dispatch from `main` with `channel: stable` - same `package.json`, no commit needed.
2. `npm view @soroush.tech/styled-system dist-tags`: `latest` is `X.Y.Z`.
3. Consumers move from the tag to `^X.Y.Z`. The next change needs a new target.

## Once per repo

The `cd-packages` environment (repo Settings -> Environments -> Deployment branches) must allow
the branches alphas come from (e.g. `feat/*`, `fix/*`, `chore/*`); `main` alone blocks every
branch alpha before it starts.
