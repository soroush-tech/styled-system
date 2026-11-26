import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const script = resolve(__dirname, 'prerelease-versions.mjs')
const cwd = process.cwd()
let dir: string

const setup = (version: string, registry: unknown, status = 200) => {
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'pkg', version }))
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: status >= 200 && status < 300,
      status,
      json: async () => registry,
    }))
  )
}

// Runs the script as the CLI would: `channel` is argv[2]; exit is turned into a throw.
const run = async (channel: string) => {
  process.argv[2] = channel
  vi.resetModules()
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(process, 'exit').mockImplementation(((code: number) => {
    throw new Error(`exit ${code}`)
  }) as never)
  const result = await import(script).then(
    () => 'ok',
    (e: Error) => e.message
  )
  const { version } = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
  return { result, log, error, version }
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'pre-'))
  process.chdir(dir)
})

afterEach(() => {
  process.chdir(cwd)
  rmSync(dir, { recursive: true, force: true })
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('rejects an unknown channel', async () => {
  setup('1.0.0', { versions: {} })
  const { result, error } = await run('beta')
  expect(result).toBe('exit 1')
  expect(error).toHaveBeenCalledWith('::error::Unknown channel "beta" - expected alpha, rc, stable')
})

it('rejects a package.json that already holds a prerelease', async () => {
  setup('1.0.0-alpha.0', { versions: {} })
  expect((await run('alpha')).result).toBe('exit 1')
})

it('numbers an alpha one above the highest on npm', async () => {
  const versions = {
    '1.0.0': {},
    '1.1.0-alpha.0': {},
    '1.1.0-alpha.3': {},
    '1.1.0-alpha.x': {},
    '1.1.0-rc.9': {},
  }
  setup('1.1.0', { versions })
  const { log, version } = await run('alpha')
  expect(version).toBe('1.1.0-alpha.4')
  expect(log).toHaveBeenCalledWith('VERSION=1.1.0-alpha.4')
})

it('starts an rc at 0', async () => {
  setup('1.1.0', { versions: { '1.0.0': {}, '1.1.0-alpha.0': {} } })
  expect((await run('rc')).version).toBe('1.1.0-rc.0')
})

it('starts at 0 for a package that was never published', async () => {
  setup('1.0.0', undefined, 404)
  expect((await run('alpha')).version).toBe('1.0.0-alpha.0')
})

it('handles a registry answer without versions', async () => {
  setup('1.0.0', {})
  expect((await run('rc')).version).toBe('1.0.0-rc.0')
})

it('refuses a prerelease of a released target', async () => {
  setup('1.0.0', { versions: { '1.0.0': {} } })
  const { result, error } = await run('alpha')
  expect(result).toBe('exit 1')
  expect(error).toHaveBeenCalledWith(
    '::error::pkg@1.0.0 is already released - bump the version first.'
  )
})

it('leaves the version alone for stable', async () => {
  setup('1.0.0', { versions: { '1.0.0': {} } })
  const { log, version } = await run('stable')
  expect(version).toBe('1.0.0')
  expect(log).toHaveBeenCalledWith('VERSION=1.0.0')
})

it('fails when the registry errors', async () => {
  setup('1.0.0', {}, 503)
  const { result, error } = await run('stable')
  expect(result).toBe('exit 1')
  expect(error).toHaveBeenCalledWith('::error::The npm registry answered 503 for pkg')
})
