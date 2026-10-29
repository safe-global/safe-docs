/* eslint-disable security/detect-non-literal-fs-filename -- writes only to a temporary copy */
import { test, type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import { execFile, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync
} from 'node:fs'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import redirects from '../redirects.json' with { type: 'json' }

const script = path.join(
  import.meta.dirname,
  '../.github/scripts/checkBuildOutput.ts'
)
const fixture = path.join(import.meta.dirname, 'fixtures/site')

// Runs the check on a copy of the fixture site after `change` edits the copy.
function check(change: (site: string) => void = () => undefined) {
  const site = mkdtempSync(path.join(tmpdir(), 'build-output-'))
  try {
    cpSync(fixture, site, { recursive: true })
    change(site)
    const result = spawnSync(process.execPath, [script, site], {
      encoding: 'utf8'
    })
    return { status: result.status, output: result.stdout + result.stderr }
  } finally {
    rmSync(site, { recursive: true, force: true })
  }
}

const addPage = (page: string, hrefs: string[]) => (site: string) =>
  writeFileSync(
    path.join(site, page),
    hrefs.map(href => `<a href="${href}">x</a>`).join('\n')
  )

test('passes on a site whose links and artifacts are all valid', () => {
  const { status, output } = check()
  assert.equal(status, 0, output)
  assert.match(output, /Checked 8 internal links on 3 pages and 7 artifacts/)
})

test('fails on broken internal links and names each page and href', () => {
  const { status, output } = check(
    addPage('extra.html', ['/missing', '/guide/'])
  )
  assert.equal(status, 1, output)
  assert.match(output, /extra\.html → \/missing\n/)
  assert.match(output, /extra\.html → \/guide\/\n/)
  assert.match(output, /2 failures/)
})

test('fails on links that only a redirects.json source satisfies', () => {
  const source = redirects.find(({ source }) => !source.includes(':'))?.source
  assert.ok(source, 'redirects.json has a literal source')
  const { status, output } = check(
    addPage('extra.html', [source, '/safenet/docs'])
  )
  assert.equal(status, 1, output)
  assert.ok(output.includes(`extra.html → ${source}\n`), output)
  assert.match(output, /extra\.html → \/safenet\/docs\n/)
})

test('resolves relative links against the page URL', () => {
  const { status, output } = check(
    addPage('guide/extra.html', ['install', '../guide'])
  )
  assert.equal(status, 0, output)
})

test('resolves a percent-encoded link', () => {
  const { status, output } = check(addPage('extra.html', ['/gui%64e/install']))
  assert.equal(status, 0, output)
})

test('fails on relative links to a missing page or a trailing slash', () => {
  const { status, output } = check(addPage('guide/extra.html', ['setup', './']))
  assert.equal(status, 1, output)
  assert.match(output, /guide\/extra\.html → setup\n/)
  assert.match(output, /guide\/extra\.html → \.\/\n/)
})

test('checks absolute links on the site host like internal links', () => {
  const { status, output } = check(
    addPage('extra.html', [
      'https://docs.safe.global/guide',
      'https://docs.safe.global/missing',
      'https://docs.safe.global.example.com/missing'
    ])
  )
  assert.equal(status, 1, output)
  assert.match(output, /extra\.html → https:\/\/docs\.safe\.global\/missing\n/)
  assert.match(output, /\n1 failures/)
})

test('fails when an artifact is an HTML page', () => {
  const { status, output } = check(site =>
    writeFileSync(
      path.join(site, 'llms-ctx.txt'),
      '<!DOCTYPE html>\n<html><body>404</body></html>'
    )
  )
  assert.equal(status, 1, output)
  assert.match(output, /llms-ctx\.txt: HTML instead of text\/plain/)
})

test('fails when an artifact starts with whitespace and then HTML', () => {
  const { status, output } = check(site =>
    writeFileSync(
      path.join(site, 'llms-ctx.txt'),
      '\n  <html><body>404</body></html>'
    )
  )
  assert.equal(status, 1, output)
  assert.match(output, /llms-ctx\.txt: HTML instead of text\/plain/)
})

test('fails when an artifact is missing', () => {
  const { status, output } = check(site =>
    unlinkSync(path.join(site, 'llms-full.txt'))
  )
  assert.equal(status, 1, output)
  assert.match(output, /llms-full\.txt: missing/)
})

test('fails when an artifact is empty', () => {
  const { status, output } = check(site =>
    writeFileSync(path.join(site, 'llms-ctx-full.txt'), '\n')
  )
  assert.equal(status, 1, output)
  assert.match(output, /llms-ctx-full\.txt: empty/)
})

test('fails when llms.txt does not name the OpenAPI spec', () => {
  const { status, output } = check(site =>
    writeFileSync(
      path.join(site, 'llms.txt'),
      '# Docs\n\nhttps://docs.safe.global/llms-full.txt\n'
    )
  )
  assert.equal(status, 1, output)
  assert.match(
    output,
    /llms\.txt: does not name https:\/\/api\.safe\.global\/tx-service\/eth\/schema\//
  )
})

test('fails when the home page does not link an artifact', () => {
  const { status, output } = check(site =>
    writeFileSync(
      path.join(site, 'index.html'),
      '<a href="https://api.safe.global/tx-service/eth/schema/">spec</a>' +
        '<a href="https://docs.safe.global/llms.txt">index</a>'
    )
  )
  assert.equal(status, 1, output)
  assert.match(
    output,
    /index\.html: no link to https:\/\/docs\.safe\.global\/llms-full\.txt/
  )
})

test('fails on a site URL in an agent file that resolves to no page or file', () => {
  const { status, output } = check(site => {
    const llms = path.join(site, 'llms.txt')
    writeFileSync(
      llms,
      readFileSync(llms, 'utf8') +
        '- [Install](https://docs.safe.global/guide/install?step=1#top)\n' +
        '- [Old page](https://docs.safe.global/old-page)\n' +
        '- [Guide](https://docs.safe.global/guide/)\n' +
        '- [Other site](https://docs.safe.global.example.com/missing)\n' +
        'See https://docs.safe.global/guide/install.\n' +
        '**https://docs.safe.global/guide**\n'
    )
    writeFileSync(path.join(site, 'a&b c.html'), '<!DOCTYPE html>\n')
    writeFileSync(
      path.join(site, 'sitemap.xml'),
      '<urlset>\n' +
        '  <url><loc>https://docs.staging.example/a&amp;b%20c</loc></url>\n' +
        '  <url><loc>https://docs.staging.example/gone</loc></url>\n' +
        '</urlset>\n'
    )
  })
  assert.equal(status, 1, output)
  assert.match(output, /\nllms\.txt → https:\/\/docs\.safe\.global\/old-page\n/)
  assert.match(output, /\nllms\.txt → https:\/\/docs\.safe\.global\/guide\/\n/)
  assert.match(
    output,
    /\nsitemap\.xml → https:\/\/docs\.staging\.example\/gone\n/
  )
  assert.match(output, /\n3 failures/)
})

// Serves each artifact path with a status and a content type, then runs --deployed on the server.
async function checkServed(
  t: TestContext,
  responses: Map<string, [number, string]>
) {
  const server = createServer((request, response) => {
    const [status, type] = responses.get(request.url ?? '') ?? [
      404,
      'text/html'
    ]
    response.writeHead(status, { 'content-type': type }).end()
  })
  t.after(() => server.close())
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address() as AddressInfo
  // The trailing slash must not turn into a `//llms.txt` request.
  const args = [script, '--deployed', `http://127.0.0.1:${port}/`]
  const result = Promise.withResolvers<{ status: number; output: string }>()
  execFile(process.execPath, args, (error, stdout, stderr) =>
    result.resolve({
      status: Number(error?.code ?? 0),
      output: stdout + stderr
    })
  )
  return result.promise
}

test('--deployed fails on a wrong status, content type or charset', async t => {
  const { status, output } = await checkServed(
    t,
    new Map([
      ['/llms.txt', [200, 'text/plain; charset=utf-8']],
      ['/llms-ctx.txt', [404, 'text/plain']],
      ['/llms-ctx-full.txt', [200, 'text/plain']],
      ['/llms-full.txt', [200, 'text/html']],
      ['/robots.txt', [200, 'text/plain; charset=utf-8']],
      ['/sitemap.xml', [200, 'application/xml']],
      ['/home/what-is-safe.md', [200, 'text/markdown']]
    ])
  )
  assert.equal(status, 1, output)
  const expected = 'expected 200 text/plain; charset=utf-8, got'
  for (const failure of [
    `llms-ctx.txt: ${expected} 404 text/plain\n`,
    `llms-ctx-full.txt: ${expected} 200 text/plain\n`,
    `llms-full.txt: ${expected} 200 text/html\n`,
    'home/what-is-safe.md: expected 200 text/markdown; charset=utf-8, got 200 text/markdown\n'
  ]) {
    assert.ok(output.includes(failure), output)
  }
  assert.match(output, /\n4 failures/)
})

test('--deployed compares the media type and the charset, not the raw header', async t => {
  const { status, output } = await checkServed(
    t,
    new Map([
      ['/llms.txt', [200, 'text/plain;charset=utf-8']],
      ['/llms-ctx.txt', [200, 'Text/Plain; Charset="UTF-8"']],
      ['/llms-ctx-full.txt', [200, 'text/plain ; charset=utf-8']],
      ['/llms-full.txt', [200, 'text/plain; charset=utf-88']],
      ['/robots.txt', [200, 'text/plain; charset=utf-8']],
      ['/sitemap.xml', [200, 'application/xml-dtd']],
      ['/home/what-is-safe.md', [200, 'text/markdown; charset=utf-8']]
    ])
  )
  assert.equal(status, 1, output)
  for (const failure of [
    'llms-full.txt: expected 200 text/plain; charset=utf-8, got 200 text/plain; charset=utf-88\n',
    'sitemap.xml: expected 200 application/xml, got 200 application/xml-dtd\n'
  ]) {
    assert.ok(output.includes(failure), output)
  }
  assert.match(output, /\n2 failures/)
})
