/* eslint-disable security/detect-non-literal-fs-filename -- uses only a temporary copy */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const script = path.join(
  import.meta.dirname,
  '../.github/scripts/generateAgentFiles.ts'
)
const fixture = path.join(import.meta.dirname, 'fixtures/agent-files')

interface Options {
  host?: string
  change?: (dir: string) => void
}

// Runs the generator on a copy of the fixture after `change` edits the copy, and reads every
// file it wrote.
function generate({ host, change }: Options = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'agent-files-'))
  try {
    cpSync(fixture, dir, { recursive: true })
    change?.(dir)
    const env = { ...process.env, NEXT_PUBLIC_HOST_URL: host }
    if (host === undefined) delete env.NEXT_PUBLIC_HOST_URL
    const built = path.join(dir, 'built')
    const args = [script, path.join(dir, 'pages'), built]
    const result = spawnSync(process.execPath, args, { encoding: 'utf8', env })
    const files = new Map(
      readdirSync(built, { recursive: true, encoding: 'utf8' })
        .filter(file => !file.endsWith('.html'))
        .filter(file => statSync(path.join(built, file)).isFile())
        .map(file => [file, readFileSync(path.join(built, file), 'utf8')])
    )
    return {
      status: result.status,
      output: result.stdout + result.stderr,
      files
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function generated(options: Options = {}) {
  const { status, output, files } = generate(options)
  assert.equal(status, 0, output)
  return files
}

const addPage =
  (route: string, source: string, extension = '.mdx') =>
  (dir: string) => {
    writeFileSync(path.join(dir, 'pages', route + extension), source)
    writeFileSync(path.join(dir, 'built', `${route}.html`), '<!DOCTYPE html>\n')
  }

const fixtureSource = (page: string) =>
  readFileSync(path.join(fixture, 'pages', page), 'utf8')

test('writes llms-full.txt in _meta.json order, unlisted pages last by name', () => {
  const host = 'https://docs.example.test'
  const corpus = generated({ host }).get('llms-full.txt') ?? ''
  const sources = [...corpus.matchAll(/^Source: (.+)$/gm)].map(m => m[1])
  assert.deepEqual(
    sources,
    [
      '/',
      '/guide',
      '/guide/setup',
      '/guide/install',
      '/guide/fences',
      '/guide/samples',
      '/about',
      '/alpha',
      '/notes',
      '/zeta'
    ].map(route => host + route)
  )
  assert.match(
    corpus,
    /Source: https:\/\/docs\.example\.test\/about\n\n# About\n/
  )
})

test('copies a .md page source and lists it in llms-full.txt', () => {
  const files = generated()
  assert.equal(files.get('notes.md'), fixtureSource('notes.md'))
  assert.match(
    files.get('llms-full.txt') ?? '',
    /\nSource: https:\/\/docs\.safe\.global\/notes\n\n# Notes\n/
  )
})

test('keeps import and export lines of a .md page as text', () => {
  const source =
    '# Prose\n\nimport the keys first.\n\nexport (see the note below.\n'
  const files = generated({ change: addPage('prose', source, '.md') })
  assert.equal(files.get('prose.md'), source)
})

test('reads CRLF, CR and BOM sources like LF sources', () => {
  const lf =
    "import Snippet from '../components/snippet.mdx'\n\n# Line ends\n\n" +
    "```js\nimport a from 'a'\n```\n\n<Snippet />\n"
  const pages = new Map([
    ['lf', lf],
    ['crlf', lf.replaceAll('\n', '\r\n')],
    ['cr', lf.replaceAll('\n', '\r')],
    ['bom', `\uFEFF${lf}`]
  ])
  const files = generated({
    change: dir => pages.forEach((source, route) => addPage(route, source)(dir))
  })
  const markdown =
    "# Line ends\n\n```js\nimport a from 'a'\n```\n\nSnippet text.\n\n<Inner />\n"
  for (const route of pages.keys()) {
    assert.equal(files.get(`${route}.md`), markdown, route)
    const section = `\nSource: https://docs.safe.global/${route}\n\n${markdown}`
    assert.ok(files.get('llms-full.txt')?.includes(section), route)
  }
})

test('drops import and export statements but keeps code samples', () => {
  const files = generated()
  const setup = files.get('guide/setup.md') ?? ''
  assert.doesNotMatch(setup, /import (Snippet|data)/)
  assert.doesNotMatch(setup, /getStaticProps|props: \{ count \}|^\s*\}$/m)
  assert.match(setup, /```ts\nimport \{ createClient \} from 'sdk'\n/)
  assert.match(setup, /\nexport const client = createClient\(\)\n```/)
  assert.match(setup, /# Setup\n\nInstall the SDK:/)
  assert.doesNotMatch(files.get('index.md') ?? '', /Callout/)
})

test('closes a fence only on its character and length, with no text after it', () => {
  const fences = generated().get('guide/fences.md')
  assert.equal(fences, fixtureSource('guide/fences.mdx'))
})

test('inlines one level of an embedded .mdx file', () => {
  const setup = generated().get('guide/setup.md') ?? ''
  assert.match(setup, /\nSnippet text\.\n\n<Inner \/>\n\nSetup is done\.\n$/)
  assert.doesNotMatch(setup, /<Snippet|Inner text|import Inner/)
})

test('takes embeds only from import statements, not from code samples', () => {
  const samples = generated().get('guide/samples.md')
  const source = fixtureSource('guide/samples.mdx')
  assert.equal(samples, source.slice(source.indexOf('# Samples')))
})

test('stops with the page path when import or export brackets do not balance', () => {
  for (const [route, source] of [
    ['open', 'export const note = 1 // see (note\n\n# Open\n'],
    ['close', "export const name = ')'\n\n# Close\n"]
  ]) {
    const { status, output } = generate({ change: addPage(route, source) })
    const message = `pages/${route}.mdx: an import or export block has unbalanced brackets`
    assert.equal(status, 1, output)
    assert.ok(output.includes(message), output)
  }
})

test('names the page when an embedded file is missing', () => {
  const page = "import Gone from './gone.mdx'\n\n# Missing embed\n\n<Gone />\n"
  const { status, output } = generate({ change: addPage('missing', page) })
  assert.equal(status, 1, output)
  assert.match(
    output,
    /pages\/missing\.mdx: embedded \S*\/pages\/gone\.mdx not found/
  )
})

test('writes a sitemap of the built routes on the host, without 404', () => {
  const host = 'https://docs.example.test'
  const sitemap = generated({ host: `${host}/` }).get('sitemap.xml') ?? ''
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
  assert.deepEqual(
    urls,
    [
      '/about',
      '/alpha',
      '/guide',
      '/guide/fences',
      '/guide/install',
      '/guide/samples',
      '/guide/setup',
      '/',
      '/notes',
      '/zeta'
    ].map(route => host + route)
  )
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset /)
})

test('encodes URLs and escapes them for XML in the sitemap', () => {
  const files = generated({
    host: 'https://docs.example.test',
    change: addPage('a&b c', '# A and B\n')
  })
  assert.match(
    files.get('sitemap.xml') ?? '',
    /<loc>https:\/\/docs\.example\.test\/a&amp;b%20c<\/loc>/
  )
  assert.match(
    files.get('llms-full.txt') ?? '',
    /\nSource: https:\/\/docs\.example\.test\/a&b%20c\n/
  )
})

test('uses https://docs.safe.global without NEXT_PUBLIC_HOST_URL', () => {
  const sitemap = generated().get('sitemap.xml') ?? ''
  assert.match(sitemap, /<loc>https:\/\/docs\.safe\.global\/about<\/loc>/)
})

test('writes a .md sibling per page and none for 404', () => {
  const files = generated()
  assert.equal(
    files.get('guide/install.md'),
    '# Install\n\nRun the installer.\n'
  )
  assert.equal(files.get('404.md'), undefined)
})
