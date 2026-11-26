# Releasing

Releases are manual: run the `CD · Packages (npm)` workflow (`.github/workflows/cd-packages.yml`: Actions, CD · Packages (npm), Run workflow) and pick a channel.

- `package.json` always holds the **target** version (for example `6.1.0`), and `release-notes/<target>.md` must exist (`pnpm check:release-notes` checks it in CI). Never edit the version into a prerelease by hand.
- `alpha`: publishes `<target>-alpha.N` under the `alpha` dist-tag, from any branch whose commit has a green `ci-ok` (open a PR first). No GitHub Release.
- `rc`: publishes `<target>-rc.N` under the `rc` dist-tag, from `main` only. A GitHub pre-release.
- `stable`: publishes `<target>` under `latest`, from `main` only. A GitHub Release.
- Each GitHub Release is tagged `@soroush.tech/styled-system@<version>` and uses `release-notes/<target>.md` as its notes.
- N is one above the highest `<target>-<channel>.N` already on npm (`scripts/prerelease-versions.mjs`). A target already on npm refuses a prerelease: bump the version first.
- A version already on npm is skipped, and a prerelease never reaches `latest` (the run fails if it does).

## One-time owner setup

1. npm: add a trusted publisher for `@soroush.tech/styled-system` with repository `soroush-tech/styled-system`, workflow `cd-packages.yml`, environment `cd-packages`.
2. GitHub: create the environment `cd-packages` (add required reviewers if a release should need approval).
3. GitHub: protect `main` and require the `ci-ok` status check.
4. Optional: enable Codecov for the repository (the upload is tokenless, via OIDC), and set the repository variable `BENCH_BOT_APP_ID` and secret `BENCH_BOT_PRIVATE_KEY` for the bench comment under the bot identity.
