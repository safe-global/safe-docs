/* eslint-disable security/detect-non-literal-fs-filename -- writes only to a temporary copy */
import { test, type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import { execFile, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { cpSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { createServer, type RequestListener } from 'node:http'
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
  assert.match(output, /Checked 8 internal links on 3 pages and 4 artifacts/)
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

type Served = [status: number, type: string, body?: string]

const SPEC: Served = [200, 'application/json', '{"openapi":"3.1.0"}']
const YAML_SPEC: Served = [
  200,
  'application/vnd.oai.openapi',
  'openapi: 3.1.0\n'
]
const VALID_ARTIFACTS = new Map<string, Served>(
  ['/llms.txt', '/llms-ctx.txt', '/llms-ctx-full.txt', '/llms-full.txt'].map(
    file => [file, [200, 'text/plain; charset=utf-8']]
  )
)

// Answers each path with its status, content type and body. Like the transaction service, the
// spec path answers YAML unless the request asks for JSON.
const respond =
  (responses: Map<string, Served>): RequestListener =>
  (request, response) => {
    const yaml =
      request.url === '/schema/' &&
      !request.headers.accept?.includes('application/json')
    const [status, type, body] = yaml
      ? YAML_SPEC
      : (responses.get(request.url ?? '') ?? [404, 'text/html'])
    response.writeHead(status, { 'content-type': type }).end(body)
  }

// Starts a server on a free port for the test and returns its URL.
async function serve(t: TestContext, listener: RequestListener) {
  const server = createServer(listener)
  t.after(() => {
    server.closeAllConnections()
    server.close()
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address() as AddressInfo
  return `http://127.0.0.1:${port}`
}

// Runs --deployed on a site and an OpenAPI spec URL, with an optional fetch timeout.
function runDeployed(site: string, spec: string, timeoutMs?: string) {
  const env = { ...process.env, DEPLOYED_FETCH_TIMEOUT_MS: timeoutMs }
  // The trailing slash must not turn into a `//llms.txt` request.
  const args = [script, '--deployed', `${site}/`, spec]
  const result = Promise.withResolvers<{ status: number; output: string }>()
  execFile(process.execPath, args, { env }, (error, stdout, stderr) =>
    result.resolve({
      status: Number(error?.code ?? 0),
      output: stdout + stderr
    })
  )
  return result.promise
}

// Serves the responses, then runs --deployed with the server's /schema/ as the OpenAPI spec.
async function checkServed(t: TestContext, responses: Map<string, Served>) {
  const site = await serve(t, respond(responses))
  const spec = `${site}/schema/`
  return { ...(await runDeployed(site, spec)), spec }
}

test('--deployed fails on a wrong status or content type', async t => {
  const { status, output } = await checkServed(
    t,
    new Map([
      ['/llms.txt', [200, 'text/plain; charset=utf-8']],
      ['/llms-ctx.txt', [404, 'text/plain']],
      ['/llms-ctx-full.txt', [200, 'text/plain']],
      ['/llms-full.txt', [200, 'text/html']],
      ['/schema/', SPEC]
    ])
  )
  assert.equal(status, 1, output)
  assert.match(
    output,
    /llms-ctx\.txt: expected 200 text\/plain, got 404 text\/plain\n/
  )
  assert.match(
    output,
    /llms-full\.txt: expected 200 text\/plain, got 200 text\/html\n/
  )
  assert.match(output, /\n2 failures/)
})

test('--deployed passes when the OpenAPI spec is JSON with openapi 3.x', async t => {
  const { status, output, spec } = await checkServed(
    t,
    new Map([...VALID_ARTIFACTS, ['/schema/', SPEC]])
  )
  assert.equal(status, 0, output)
  assert.ok(output.includes(`${spec}: 200 application/json\n`), output)
})

test('--deployed fails on an OpenAPI spec that is missing, not JSON or not 3.x', async t => {
  const cases: [Served | undefined, string][] = [
    [undefined, 'expected 200, got 404 text/html'],
    [[200, 'application/json', '<html></html>'], 'body is not JSON'],
    [[200, 'application/json', '{"swagger":"2.0"}'], 'no openapi field'],
    [[200, 'application/json', 'null'], 'no openapi field'],
    [
      [200, 'application/json', '{"openapi":"2.0"}'],
      'openapi "2.0" is not 3.x'
    ],
    [[200, 'application/json', '{"openapi":3.1}'], 'openapi 3.1 is not 3.x']
  ]
  for (const [served, reason] of cases) {
    const responses = new Map(VALID_ARTIFACTS)
    if (served) responses.set('/schema/', served)
    const { status, output, spec } = await checkServed(t, responses)
    assert.equal(status, 1, output)
    assert.ok(output.includes(`\n${spec}: ${reason}\n1 failures`), output)
  }
})

// The script gets a 200 ms fetch timeout, so these tests must end well within 10 s.
test(
  '--deployed gives one failure line per request that times out',
  { timeout: 10_000 },
  async t => {
    const site = await serve(t, () => undefined)
    const { status, output } = await runDeployed(site, `${site}/schema/`, '200')
    assert.equal(status, 1, output)
    const timeout = 'request failed: The operation was aborted due to timeout'
    const lines = output.split('\n').filter(line => line.endsWith(timeout))
    assert.ok(lines.includes(`${site}/llms.txt: ${timeout}`), output)
    assert.ok(lines.includes(`${site}/schema/: ${timeout}`), output)
    assert.ok(output.endsWith(`\n${lines.length} failures\n`), output)
  }
)

test(
  '--deployed fails when the OpenAPI spec body stalls',
  { timeout: 10_000 },
  async t => {
    const served = respond(new Map(VALID_ARTIFACTS))
    const site = await serve(t, (request, response) => {
      if (request.url !== '/schema/') return served(request, response)
      response.writeHead(200, { 'content-type': 'application/json' })
      response.write('{"openapi"')
    })
    const spec = `${site}/schema/`
    const { status, output } = await runDeployed(site, spec, '200')
    assert.equal(status, 1, output)
    const failure = `${spec}: request failed: The operation was aborted due to timeout`
    assert.ok(output.endsWith(`\n${failure}\n1 failures\n`), output)
  }
)

test('--deployed reports a refused connection and keeps the other failures', async t => {
  const closed = createServer().listen(0, '127.0.0.1')
  await once(closed, 'listening')
  const { port } = closed.address() as AddressInfo
  closed.close()
  await once(closed, 'close')
  const responses = new Map(VALID_ARTIFACTS)
  responses.set('/llms.txt', [200, 'text/html'])
  const site = await serve(t, respond(responses))
  const spec = `http://127.0.0.1:${port}/schema/`
  const { status, output } = await runDeployed(site, spec)
  assert.equal(status, 1, output)
  assert.match(
    output,
    /\nllms\.txt: expected 200 text\/plain[^\n]*, got 200 text\/html\n/
  )
  const refused = `${spec}: request failed: connect ECONNREFUSED 127.0.0.1:${port}`
  assert.ok(output.endsWith(`\n${refused}\n2 failures\n`), output)
})
