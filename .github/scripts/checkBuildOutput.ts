/* eslint-disable @typescript-eslint/no-require-imports -- ts-node runs the scripts as CommonJS */
/* eslint-disable security/detect-non-literal-fs-filename -- reads only the build output */
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
  if (NOT_INTERNAL.test(href) && !href.startsWith(SITE)) return undefined
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

async function checkDeployed(site: string): Promise<string[]> {
  const failures: string[] = []
  for (const [name, type] of ARTIFACTS) {
    const response = await fetch(`${site}/${name}`)
    const contentType = response.headers.get('content-type') ?? ''
    const result = `${response.status} ${contentType}`
    console.info(`${site}/${name}: ${result}`)
    if (response.status !== 200 || !hasContentType(contentType, type)) {
      failures.push(`${name}: expected 200 ${type}, got ${result}`)
    }
  }
  return failures
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

async function main(args: string[]): Promise<void> {
  const failures =
    args[0] === '--deployed'
      ? await checkDeployed((args[1] ?? SITE).replace(/\/+$/, ''))
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
