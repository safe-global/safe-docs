/* eslint-disable security/detect-non-literal-fs-filename -- reads the repo and a temporary copy */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const root = path.join(import.meta.dirname, '..')
const script = path.join(root, '.github/scripts/generateQueueReference.ts')
const SCHEMA_FILE =
  'components/ApiReference/schemas/safe-queue-service-swagger.json'
const MDX_FILE =
  'components/ApiReference/generated/safe-queue-service-reference.mdx'
const BASE_URL = 'https://api.safe.global/queue'
const METHODS = ['get', 'post', 'put', 'patch', 'delete']

interface Operation {
  tags: string[]
  title: string
}

const schema = JSON.parse(
  readFileSync(path.join(root, SCHEMA_FILE), 'utf8')
) as {
  paths: Record<string, Record<string, Operation>>
}
const mdx = readFileSync(path.join(root, MDX_FILE), 'utf8')
const operations = Object.entries(schema.paths).flatMap(([route, methods]) =>
  Object.entries(methods)
    .filter(([method]) => METHODS.includes(method))
    .map(([method, operation]) => ({ route, method, operation }))
)
const rendered = operations.filter(
  ({ operation }) => operation.tags[0] !== 'About'
)
const curls = [...mdx.matchAll(/^curl -X (\w+) ("?)(\S+?)\2(?: \\)?$/gm)].map(
  ([, method, , url]) => ({ method, url })
)

// Whether the URL calls the route, with each {parameter} filled in.
function callsRoute(url: string, route: string): boolean {
  const actual = url.split('?')[0].split('/')
  const expected = (BASE_URL + route).split('/')
  return (
    actual.length === expected.length &&
    expected.every((part, i) => part === actual.at(i) || /^\{\w+\}$/.test(part))
  )
}

const run = (cwd: string, ...args: string[]) =>
  spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' })

test('the committed schema and reference are up to date', () => {
  const result = run(root, '--check')
  assert.equal(result.status, 0, result.stdout + result.stderr)
})

test('two runs write byte-identical files', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'queue-reference-'))
  try {
    for (const file of [SCHEMA_FILE, MDX_FILE])
      cpSync(path.join(root, file), path.join(dir, file))
    const outputs = [1, 2].map(() => {
      const result = run(dir)
      assert.equal(result.status, 0, result.stdout + result.stderr)
      return [SCHEMA_FILE, MDX_FILE].map(file =>
        readFileSync(path.join(dir, file), 'utf8')
      )
    })
    assert.deepEqual(outputs[1], outputs[0])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('every operation but About has a path block and a queue curl', () => {
  assert.equal(curls.length, rendered.length)
  for (const { route, method } of rendered) {
    assert.ok(
      mdx.includes(`<Path path="${route}" method="${method}" />`),
      `${method} ${route} has no <Path>`
    )
    assert.ok(
      curls.some(
        c => c.method === method.toUpperCase() && callsRoute(c.url, route)
      ),
      `${method} ${route} has no curl`
    )
  }
  for (const { url } of curls)
    assert.ok(url.startsWith(`${BASE_URL}/api/v1/`), url)
})

test('About is not rendered', () => {
  const about = operations.filter(
    ({ operation }) => operation.tags[0] === 'About'
  )
  assert.ok(about.length > 0)
  for (const { route, operation } of about) {
    assert.ok(!mdx.includes(`<Path path="${route}"`), route)
    assert.ok(!mdx.includes(`### ${operation.title}\n`), operation.title)
  }
  assert.doesNotMatch(mdx, /^## About$/m)
})

test('titles are unique and every rendered tag has a section', () => {
  const titles = [...mdx.matchAll(/^### (.+)$/gm)].map(([, title]) => title)
  assert.equal(new Set(titles).size, titles.length)
  assert.deepEqual(
    titles.sort(),
    rendered.map(({ operation }) => operation.title).sort()
  )
  const sections = [...mdx.matchAll(/^## (.+)$/gm)].map(([, title]) => title)
  for (const { operation } of rendered)
    assert.ok(sections.includes(operation.tags[0]), operation.tags[0])
})

test('curl samples call the queue service with an API key and clean URLs', () => {
  assert.doesNotMatch(mdx, /tx-service/)
  const commands = mdx.split(/^curl /m).slice(1)
  assert.equal(commands.length, curls.length)
  for (const command of commands)
    assert.match(command, /-H "Authorization: Bearer YOUR_API_KEY"/)
  for (const { url } of curls) {
    assert.doesNotMatch(url, /\/(\?|$)/, url)
    assert.doesNotMatch(url, /\s/, url)
  }
  for (const line of mdx.match(/^curl .*\?.*$/gm) ?? [])
    assert.match(line, / "https:\/\/[^"]+"(?: \\)?$/, line)
})
