import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const script = resolve(__dirname, 'check-release-notes.mjs')
const cwd = process.cwd()
let dir: string

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'notes-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'pkg', version: '1.2.3' }))
  process.chdir(dir)
  vi.resetModules()
})

afterEach(() => {
  process.chdir(cwd)
  rmSync(dir, { recursive: true, force: true })
  vi.restoreAllMocks()
})

it('passes when the notes file for the version exists', async () => {
  mkdirSync(join(dir, 'release-notes'))
  writeFileSync(join(dir, 'release-notes', '1.2.3.md'), '# 1.2.3')
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  await import(script)
  expect(log).toHaveBeenCalledWith('Release notes present for pkg@1.2.3.')
})

it('fails when the notes file is missing', async () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  const exit = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
  vi.spyOn(console, 'log').mockImplementation(() => {})
  await import(script)
  expect(exit).toHaveBeenCalledWith(1)
  expect(error).toHaveBeenCalledWith('Missing release notes: release-notes/1.2.3.md (pkg@1.2.3)')
})
