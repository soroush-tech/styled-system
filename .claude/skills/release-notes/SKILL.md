---
name: release-notes
description: How to write and cut a GitHub Release for @soroush.tech/styled-system published by cd-packages.yml - notes live in an in-repo file `release-notes/<version>.md`, the semver bump rule, a linked PR/issue reference as an absolute URL (required for feature/fix releases, waived for dependency-bump-only ones which instead list every bump), and the breaking-change, new-API-doc-link, and packaging side-note sections. Use when releasing or drafting release notes.
metadata:
  internal: true
---

# Release notes

Publishing is **manual**, and notes live in a **versioned file committed to the repo**:
`release-notes/<version>.md`, where `<version>` matches `package.json`. The workflow requires that
file to exist before it publishes - the package can never ship with empty notes. See
[`RELEASING.md`](../../../RELEASING.md) for the workflow. This skill is about writing that file.

The file is plain multi-line markdown. Notes files never ship to npm: `package.json` uses a
`files: ["dist"]` allowlist, so `release-notes/` is excluded from the tarball automatically.

Every file **starts with a `## @soroush.tech/styled-system@<version>` heading** - it's the only
title the file carries (a GitHub Release shows the tag separately; the standalone file doesn't).
The directory is the full per-version history - one file per released version, browsable and
linked from the README.

**Repo links** use `soroush-tech/styled-system`: `blob/main/...` for a file, `tree/main/...` for a
directory.

## Before you write notes: bump the version (semver)

A release is bumping `version` in `package.json` on `main` **and** adding the matching
`release-notes/<version>.md`, in the same PR. The publish step skips a version already on npm, so
the **version number is the release**. Follow [semver](https://semver.org) - the bump decides which
sections the notes need.

| Bump      | `x.y.z` → | Use for                                                                  |
| --------- | --------- | ------------------------------------------------------------------------ |
| **PATCH** | `x.y.Z+1` | Backward-compatible bug fixes; dependency/maintenance-only changes       |
| **MINOR** | `x.Y+1.0` | Backward-compatible **new features / new public API** (reset patch to 0) |
| **MAJOR** | `X+1.0.0` | **Any change that breaks backward compatibility** (reset minor+patch)    |

> Breaking a **dependency contract** (raising a peer-dependency floor consumers must meet,
> dropping a supported runtime) is a breaking change - bump **MAJOR**, even if your own code
> is untouched. A backward-compatible dep bump is PATCH.

## Required contents

Every release body **must** have:

1. **A PR or issue reference, as a full link** - `[#<number>](https://github.com/soroush-tech/styled-system/issues/<number>)`
   somewhere in the notes (lead line or a bullet). Ties a **feature or fix** release to its
   change history. Required for any release that changes behavior or API.

   Write the **absolute URL**, never a bare `#<number>`. A bare reference only autolinks in
   GitHub's issue/PR/Release UI - these files are also browsed in-repo at `blob/main/...`, where
   it renders as plain text. Same reason the doc links in rule 3 are absolute. (Note this is the
   opposite of the [`github-issues`](../github-issues/SKILL.md) rule: inside an _issue or PR
   body_, reference issues bare so GitHub renders the title.)

   **Exception:** a maintenance / dependency-bump-only release (a PATCH that only refreshes
   dependencies) may have no owning issue - the reference is **not required** there; instead
   **list exactly what was bumped** (see rule 4).

2. **Breaking changes**, if any - a `### BREAKING CHANGES` section spelling out what broke and
   the migration. Its presence means the bump must be MAJOR.
3. **New public API**, if any - name each new export **and link its doc**. API docs live under
   `docs/*.md`. Link the repo-hosted file (a `blob/main` URL) so it resolves from the GitHub
   Release page, where relative links don't:
   `https://github.com/soroush-tech/styled-system/blob/main/docs/<file>.md#<anchor>`.
4. **A packaging side note** - a `### Packaging` section for packaging-level changes:
   dependency-floor raises, peer/optional-peer changes, engine/runtime requirements, repo moves.
   For a dependency-bump-only release this section **is** the release notes - **name every
   package bumped with its `old → new` version**, don't just say "dependency bumps". Omit the
   section only when there were genuinely no packaging changes.

## Template

`release-notes/<version>.md`:

```markdown
## @soroush.tech/styled-system@<version>

<one-line summary of what changed and why>
([#<number>](https://github.com/soroush-tech/styled-system/issues/<number>))

### Added

- **`newExport`** - one line on what it does.
  [docs](https://github.com/soroush-tech/styled-system/blob/main/docs/<file>.md#anchor)

### Changed

- <backward-compatible behavior change>.

### Fixed

- <bug fix> ([#<number>](https://github.com/soroush-tech/styled-system/issues/<number>)).

### BREAKING CHANGES

- <what broke> - <how to migrate>.

### Packaging

- Raise `<dep>` floor `^a.b.c` → `^x.y.z`.
- `<peer>` is now an optional peer dependency.
```

Include only the sections that apply. Keep a linked issue reference for any feature/fix
release; keep the `### Packaging` note whenever packaging changed. Match the tone of the last
release: read the previous `release-notes/*.md`.

### Maintenance (dependency-bump-only) release

When the package ships only because its dependencies were refreshed - no code, no API change -
skip the issue link and let `### Packaging` carry the notes, naming each bump explicitly:

```markdown
## @soroush.tech/styled-system@<version>

Maintenance release - dependency refresh only. No public API or behavior changes.

### Packaging

- `<dep>` `^a.b.c` → `^x.y.z`.
- Dev-dependency bumps: `<devDep>` `^a.b.c` → `^x.y.z`, `<devDep2>` `^a.b.c` → `^x.y.z`.
```

## Cutting the release

1. In **one PR to `main`** (CI must pass): bump `version` in `package.json` **and** add
   `release-notes/<version>.md` with the notes. The filename must equal the new version -
   `pnpm check:release-notes` (CI lint job) fails the build if the version has no matching notes
   file, and the workflow's "Require release notes" step fails again before publishing.
2. Dispatch - Actions → **CD · Packages (npm)** → pick `channel`, **Run**. A prerelease
   (`alpha`, `rc`) uses the target's notes file - see the [`prerelease`](../prerelease/SKILL.md)
   skill.
3. The job publishes to npm (skips if that version already exists) and cuts a GitHub Release
   tagged/titled `@soroush.tech/styled-system@<version>` from the notes file. Re-running repairs
   a missing Release without republishing.

> This machine can't `git push` and has no `gh` CLI - commit the version bump + notes file
> locally, then ask the user to push and to run the dispatch.
