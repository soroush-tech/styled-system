// Turns package.json's target version into the one a cd-packages.yml run publishes, in the CI checkout
// only (nothing is committed). Prints `VERSION=<version>` for $GITHUB_ENV.
//
//   node scripts/prerelease-versions.mjs <alpha|rc|stable>
//
// package.json holds the target version (`6.1.0`); this script never asks anyone to edit it.
// - stable: the version stays as it is.
// - alpha / rc: it becomes `<target>-<channel>.N`, N one above the highest already on npm for
//   that target and channel (0 when there is none). A target that is already released fails
//   the run.
import { readFileSync, writeFileSync } from 'node:fs'

const CHANNELS = ['alpha', 'rc', 'stable']
const REGISTRY = 'https://registry.npmjs.org'
const channel = process.argv[2]

const fail = (message) => {
  console.error(`::error::${message}`)
  process.exit(1)
}

if (!CHANNELS.includes(channel))
  fail(`Unknown channel "${channel}" - expected ${CHANNELS.join(', ')}`)

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
if (pkg.version.includes('-'))
  fail(`${pkg.name}: package.json must hold the target version, not ${pkg.version}`)

// Every version of the package on npm; [] before its first publish.
const response = await fetch(`${REGISTRY}/${pkg.name}`, { signal: AbortSignal.timeout(15_000) })
if (response.status !== 404 && !response.ok)
  fail(`The npm registry answered ${response.status} for ${pkg.name}`)
const versions = response.ok ? Object.keys((await response.json()).versions ?? {}) : []

if (channel !== 'stable') {
  if (versions.includes(pkg.version))
    fail(`${pkg.name}@${pkg.version} is already released - bump the version first.`)
  const prefix = `${pkg.version}-${channel}.`
  const numbers = versions
    .filter((version) => version.startsWith(prefix))
    .map((version) => Number(version.slice(prefix.length)))
    .filter(Number.isInteger)
  const next = `${pkg.version}-${channel}.${numbers.length ? Math.max(...numbers) + 1 : 0}`
  console.error(`${pkg.name}: ${pkg.version} -> ${next}`)
  pkg.version = next
  writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}\n`)
}

console.log(`VERSION=${pkg.version}`)
