// Guard on the publishable package: a release-notes file must exist for its current version.
// cd-packages.yml reads release-notes/<version>.md at publish time and refuses to release without it;
// this catches the same gap earlier, so a version bump can't land on main without its notes.
// Run `pnpm check:release-notes`.
import { existsSync, readFileSync } from 'node:fs'

const { name, version } = JSON.parse(readFileSync('package.json', 'utf8'))
const file = `release-notes/${version}.md`

if (!existsSync(file)) {
  console.error(`Missing release notes: ${file} (${name}@${version})`)
  console.error('\nAdd the file above, then commit.')
  process.exit(1)
}

console.log(`Release notes present for ${name}@${version}.`)
