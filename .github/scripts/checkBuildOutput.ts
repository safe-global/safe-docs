const fs: typeof import('fs') = require('fs')
const path: typeof import('path') = require('path')

const SITE = 'https://docs.safe.global'
const OPENAPI_SPEC = 'https://api.safe.global/tx-service/eth/schema/'
const TEXT = 'text/plain; charset=utf-8'
// File in the build output → content type it must have when deployed.
const ARTIFACTS = new Map([
  ['llms.txt', TEXT],
  ['llms-ctx.txt', TEXT],
  ['llms-ctx-full.txt', TEXT],
  ['llms-full.txt', TEXT],
  ['robots.txt', TEXT],
  ['sitemap.xml', 'application/xml'],
  ['home/what-is-safe.md', 'text/markdown; charset=utf-8']
])
const REQUIRED_TEXT = new Map([
  ['llms.txt', [OPENAPI_SPEC, `${SITE}/llms-full.txt`]]
])
const HOME_PAGE_LINKS = [
  OPENAPI_SPEC,
  `${SITE}/llms.txt`,
  `${SITE}/llms-full.txt`
]

const HREF = /\shref=(?:"([^"]*)"|'([^']*)')/g
const NOT_INTERNAL = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i
const HTML_DOCUMENT = /^\s*<(?:!doctype html|html[\s>])/i
const BASE_URL = 'http://build.invalid'
// The specs set DEPLOYED_FETCH_TIMEOUT_MS to test a server that never answers.
const FETCH_TIMEOUT_MS = Number(process.env.DEPLOYED_FETCH_TIMEOUT_MS) || 30_000
// ponytail: a site URL in a text file ends at whitespace, a quote, a bracket or a backtick,
// so a route with one of these characters fails the check. No route has one. As in GFM
// autolinks, punctuation at the end is not part of the URL.
const SITE_URL = /https:\/\/docs\.safe\.global(?![\w.:-])[^\s"'`<>()[\]]*/g
const TRAILING_PUNCTUATION = /[.,;:!?*_~|]+$/
const LOC = /<loc>([^<]*)<\/loc>/g
const XML_ENTITY = /&(amp|lt|gt|quot|apos);/g
const XML_CHARS = new Map([
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['quot', '"'],
  ['apos', "'"]
])

const isFile = (file: string): boolean =>
  fs.statSync(file, { throwIfNoEntry: false })?.isFile() ?? false

const readHrefs = (html: string): string[] =>
  [...html.matchAll(HREF)].map(match => match[1] ?? match[2])

function resolves(outDir: string, pathname: string): boolean {
  let route: string
  try {
    route = decodeURIComponent(pathname)
  } catch {
    return false
  }
  const candidates = [route, `${route}.html`, `${route}/index.html`]
  return candidates.some(file => isFile(path.join(outDir, file)))
}

// Path of an href on this site, or undefined when the href points elsewhere.
function internalPath(href: string, page: string): string | undefined {
  if (NOT_INTERNAL.test(href)) {
    try {
      if (new URL(href).origin !== SITE) return undefined
    } catch {
      return undefined
    }
  }
  const url = new URL(href, `${BASE_URL}/${page.replace(/\.html$/, '')}`)
  const onSite = url.origin === BASE_URL || url.origin === SITE
  if (!onSite || url.pathname.startsWith('/_next/')) return undefined
  return url.pathname
}

function checkLinks(outDir: string) {
  const pages = (fs.readdirSync(outDir, { recursive: true }) as string[])
    .filter(file => file.endsWith('.html'))
    .sort()
  const failures: string[] = []
  let links = 0
  for (const page of pages) {
    const html = fs.readFileSync(path.join(outDir, page), 'utf8')
    for (const href of new Set(readHrefs(html))) {
      const pathname = internalPath(href, page)
      if (pathname === undefined) continue
      links++
      if (!resolves(outDir, pathname)) {
        failures.push(`${page} → ${href}`)
      }
    }
  }
  return { pages: pages.length, links, failures }
}

// The URLs that an artifact names: every <loc> of the sitemap, or the site URLs of a text file.
function artifactUrls(name: string, text: string): string[] {
  const urls =
    name === 'sitemap.xml'
      ? [...text.matchAll(LOC)].map(([, loc]) =>
          loc.replace(XML_ENTITY, (entity, key) => XML_CHARS.get(key) ?? entity)
        )
      : [...text.matchAll(SITE_URL)].map(([url]) =>
          url.replace(TRAILING_PUNCTUATION, '')
        )
  return [...new Set(urls)]
}

function checkUrls(outDir: string, name: string, text: string): string[] {
  const urls = artifactUrls(name, text)
  console.info(`Checked ${urls.length} site URLs in ${name}`)
  return urls
    .filter(url => !resolves(outDir, new URL(url).pathname))
    .map(url => `${name} → ${url}`)
}

function checkArtifact(outDir: string, name: string, type: string): string[] {
  const file = path.join(outDir, name)
  if (!isFile(file)) return [`${name}: missing`]
  const text = fs.readFileSync(file, 'utf8')
  if (text.trim() === '') return [`${name}: empty`]
  if (HTML_DOCUMENT.test(text)) return [`${name}: HTML instead of ${type}`]
  return (REQUIRED_TEXT.get(name) ?? [])
    .filter(required => !text.includes(required))
    .map(required => `${name}: does not name ${required}`)
    .concat(checkUrls(outDir, name, text))
}

function checkArtifacts(outDir: string): string[] {
  const failures = [...ARTIFACTS].flatMap(([name, type]) =>
    checkArtifact(outDir, name, type)
  )
  const homePage = path.join(outDir, 'index.html')
  const hrefs = isFile(homePage)
    ? readHrefs(fs.readFileSync(homePage, 'utf8'))
    : []
  return failures.concat(
    HOME_PAGE_LINKS.filter(url => !hrefs.includes(url)).map(
      url => `index.html: no link to ${url}`
    )
  )
}

// The media type and the charset of a Content-Type value, in lower case and without quotes.
function parseContentType(value: string): { type: string; charset?: string } {
  const [type, ...params] = value
    .toLowerCase()
    .split(';')
    .map(part => part.trim())
  const charset = params.find(param => param.startsWith('charset='))
  return {
    type,
    charset: charset?.slice('charset='.length).replace(/^"(.*)"$/, '$1')
  }
}

// True when the value has the expected media type and, if one is expected, the same charset.
function hasContentType(value: string, expected: string): boolean {
  const actual = parseContentType(value)
  const wanted = parseContentType(expected)
  const charsetMatches = !wanted.charset || actual.charset === wanted.charset
  return actual.type === wanted.type && charsetMatches
}

// One failure line for a request that threw, with the innermost cause, for example
// "connect ECONNREFUSED 127.0.0.1:80" or "The operation was aborted due to timeout".
function requestFailure(url: string, error: unknown): string {
  const cause =
    error instanceof Error && error.cause !== undefined ? error.cause : error
  if (!(cause instanceof Error))
    return `${url}: request failed: ${String(cause)}`
  const code = 'code' in cause ? cause.code : undefined
  return `${url}: request failed: ${cause.message || String(code ?? cause.name)}`
}

// Fetches a deployed URL with a timeout. A request that throws gives its failure line.
async function fetchDeployed(
  url: string,
  headers: Record<string, string> = {}
): Promise<Response | string> {
  try {
    return await fetch(url, {
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    })
  } catch (error) {
    return requestFailure(url, error)
  }
}

// Why a spec body is not JSON with an `openapi` field that is a 3.x version, if it is not.
function openApiFailure(body: string): string | undefined {
  let spec: unknown
  try {
    spec = JSON.parse(body)
  } catch {
    return 'body is not JSON'
  }
  const version = (spec as { openapi?: unknown } | null)?.openapi
  if (version === undefined) return 'no openapi field'
  if (typeof version === 'string' && version.startsWith('3.')) return undefined
  return `openapi ${JSON.stringify(version)} is not 3.x`
}
// The OpenAPI spec must answer 200 with JSON whose `openapi` field is a 3.x version.
// Without `Accept: application/json`, the transaction service sends the spec as YAML.
async function checkOpenApiSpec(url: string): Promise<string[]> {
  const response = await fetchDeployed(url, { accept: 'application/json' })
  if (typeof response === 'string') return [response]
  const result = `${response.status} ${response.headers.get('content-type') ?? ''}`
  console.info(`${url}: ${result}`)
  if (response.status !== 200) return [`${url}: expected 200, got ${result}`]
  let body: string
  try {
    body = await response.text()
  } catch (error) {
    return [requestFailure(url, error)]
  }
  const failure = openApiFailure(body)
  return failure ? [`${url}: ${failure}`] : []
}

async function checkDeployed(
  site: string,
  openApiSpec: string
): Promise<string[]> {
  const failures: string[] = []
  for (const [name, type] of ARTIFACTS) {
    const response = await fetchDeployed(`${site}/${name}`)
    if (typeof response === 'string') {
      failures.push(response)
      continue
    }
    const contentType = response.headers.get('content-type') ?? ''
    const result = `${response.status} ${contentType}`
    console.info(`${site}/${name}: ${result}`)
    if (response.status !== 200 || !hasContentType(contentType, type)) {
      failures.push(`${name}: expected 200 ${type}, got ${result}`)
    }
  }
  return failures.concat(await checkOpenApiSpec(openApiSpec))
}

function checkBuild(outDir: string): string[] {
  if (!fs.statSync(outDir, { throwIfNoEntry: false })?.isDirectory()) {
    return [`${outDir}: build output not found, run pnpm build first`]
  }
  const { pages, links, failures } = checkLinks(outDir)
  console.info(
    `Checked ${links} internal links on ${pages} pages and ${ARTIFACTS.size} artifacts`
  )
  return failures.concat(checkArtifacts(outDir))
}

// Usage: checkBuildOutput.ts [outDir] | --deployed [site] [openApiSpecUrl]
async function main(args: string[]): Promise<void> {
  const failures =
    args[0] === '--deployed'
      ? await checkDeployed(
          (args[1] ?? SITE).replace(/\/+$/, ''),
          args[2] ?? OPENAPI_SPEC
        )
      : checkBuild(args[0] ?? 'out')
  if (failures.length === 0) return
  failures.forEach(failure => console.error(failure))
  console.error(`${failures.length} failures`)
  process.exitCode = 1
}

main(process.argv.slice(2)).catch(error => {
  console.error(error)
  process.exitCode = 1
})
