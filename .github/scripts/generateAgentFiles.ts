const fs: typeof import('fs') = require('fs')
const path: typeof import('path') = require('path')

const SOURCE_EXTENSIONS = ['.mdx', '.md']
const FENCE = /^\s*(`{3,}|~{3,})(.*)$/
const ESM = /^(?:import|export)\s/
const MDX_IMPORT = /^import\s+(\w+)\s+from\s+['"]([^'"]+\.mdx?)['"]/gm
const EMBED = /^<(\w+)\s*\/>\s*$/
const API_REFERENCE = /^<ApiReference\s+networkName="([^"]+)"\s*\/>\s*$/
// An API URL in a generated API reference → the OpenAPI spec under that URL and its service.
const API_SPECS = [
  {
    api: /https:\/\/api\.safe\.global\/tx-service\/[\w-]+\//,
    spec: 'schema/',
    service: 'Safe Transaction Service',
    notes: ['The spec URL answers YAML; add ?format=json for JSON.\n']
  },
  {
    api: /https:\/\/api\.safe\.global\/decoder\//,
    spec: 'openapi.json',
    service: 'Safe Decoder Service',
    notes: []
  }
]
const HEADING = /^# /
const HTML_HEAD = /<head[\s>][\s\S]*?<\/head>/
const HTML_TITLE = /<title>([\s\S]*?)<\/title>/
const REACT_SEPARATOR = /<!-- -->/g
const HTML_ENTITY = /&(amp|lt|gt|quot|#39);/g
const HTML_CHARS = new Map([
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['quot', '"'],
  ['#39', "'"]
])
const TITLE_SUFFIX = / – Safe Docs$/
const XML_ENTITIES = new Map([
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ["'", '&apos;']
])

interface Page {
  url: string
  markdown: string
}

interface Line {
  text: string
  fenced: boolean
}

const isFile = (file: string): boolean =>
  fs.statSync(file, { throwIfNoEntry: false })?.isFile() ?? false

// The open code fence after `line`, or '' outside a fence. A fence closes only on a line with
// the same character, at least as long, and nothing after it.
function nextFence(open: string, line: string): string {
  const match = line.match(FENCE)
  if (!match) return open
  const [, marker, rest] = match
  if (!open) return marker
  const closes =
    marker[0] === open[0] && marker.length >= open.length && rest.trim() === ''
  return closes ? '' : open
}

// Nextra compiles only .mdx files as MDX. In a .md file, import and export lines are text.
const startsEsm = (file: string, fence: string, line: string): boolean =>
  file.endsWith('.mdx') && fence === '' && ESM.test(line)

// Source text as MDX reads it: no byte order mark, and "\n" at the end of each line.
const readSource = (file: string): string =>
  fs
    .readFileSync(file, 'utf8')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')

// MDX reads a line that starts with import or export as JavaScript, up to the first blank
// line where the code is complete.
function splitMdx(file: string): { esm: string[]; lines: Line[] } {
  const unbalanced = `${file}: an import or export block has unbalanced brackets`
  const esm: string[] = []
  const lines: Line[] = []
  let fence = ''
  let inEsm = false
  let depth = 0
  for (const text of readSource(file).split('\n')) {
    if (!inEsm) {
      fence = nextFence(fence, text)
      inEsm = startsEsm(file, fence, text)
      depth = 0
    }
    if (!inEsm) {
      lines.push({ text, fenced: fence !== '' })
      continue
    }
    esm.push(text)
    depth += text.split(/[{[(]/).length - text.split(/[}\])]/).length
    if (depth < 0) throw new Error(unbalanced)
    inEsm = text.trim() !== '' || depth > 0
  }
  if (depth > 0) throw new Error(unbalanced)
  return { esm, lines }
}

const markdownOf = (file: string): string =>
  splitMdx(file)
    .lines.map(line => line.text)
    .join('\n')
    .trim()

// The _meta.json of a pages directory, or {} when the directory has none.
function readMeta(dir: string): Record<string, unknown> {
  const meta = path.join(dir, '_meta.json')
  return isFile(meta) ? JSON.parse(fs.readFileSync(meta, 'utf8')) : {}
}

// The title of a page in the _meta.json of its directory, if it has one.
function sidebarTitle(file: string): string | undefined {
  const name = path.basename(file).replace(/\.mdx?$/, '')
  const entry = readMeta(path.dirname(file))[name]
  if (typeof entry === 'string') return entry
  const title = (entry as { title?: unknown } | null | undefined)?.title
  return typeof title === 'string' ? title : undefined
}

// The <title> in the <head> of the built page as text, without the site suffix.
function htmlTitle(html: string): string | undefined {
  const head = fs.readFileSync(html, 'utf8').match(HTML_HEAD)?.[0] ?? ''
  const title = head
    .match(HTML_TITLE)?.[1]
    .replace(REACT_SEPARATOR, '')
    .replace(HTML_ENTITY, (entity, name) => HTML_CHARS.get(name) ?? entity)
    .replace(TITLE_SUFFIX, '')
    .trim()
  return title || undefined
}

// The title of a page: its HTML title, else its _meta.json title, else the network name.
const pageTitle = (file: string, network: string, html: string): string =>
  htmlTitle(html) ??
  sidebarTitle(file) ??
  network
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

// The OpenAPI spec of the API URL that comes first in the generated reference, of the URLs
// that match one of the API_SPECS patterns.
function apiSpec(file: string, reference: string) {
  if (!isFile(reference)) throw new Error(`${file}: ${reference} not found`)
  const text = fs.readFileSync(reference, 'utf8')
  const first = API_SPECS.flatMap(entry => {
    const match = entry.api.exec(text)
    return match
      ? [{ ...entry, url: match[0] + entry.spec, at: match.index }]
      : []
  }).sort((a, b) => a.at - b.at)[0]
  if (!first)
    throw new Error(
      `${file}: ${reference} names no API URL for an OpenAPI spec`
    )
  return first
}

// The text that replaces an <ApiReference networkName="…"/> line: the service and a link to
// its OpenAPI spec, because the component renders the reference from that spec.
function apiReferenceStub(
  file: string,
  network: string,
  generatedDir: string
): string {
  const reference = path.join(generatedDir, `${network}-reference.mdx`)
  const { url, service, notes } = apiSpec(file, reference)
  return [
    `This page is the ${service} API reference.\n`,
    'The full reference of this API is its OpenAPI spec:',
    `${url}\n`,
    ...notes,
    'The spec needs no API key.'
  ].join('\n')
}

// The Markdown copy of a page. It inlines one level of the .mdx files that the page embeds as
// `<Name />`, and replaces each <ApiReference networkName="…"/> line with a link to its
// OpenAPI spec. Such a page without a "# " heading gets its title first.
function toMarkdown(file: string, generatedDir: string, html: string): string {
  const { esm, lines } = splitMdx(file)
  const embeds = new Map(
    [...esm.join('\n').matchAll(MDX_IMPORT)].map(([, name, target]) => [
      name,
      path.resolve(path.dirname(file), target)
    ])
  )
  const networks: string[] = []
  const markdown = lines.map(({ text, fenced }) => {
    if (fenced) return text
    const network = text.match(API_REFERENCE)?.[1]
    if (network) {
      networks.push(network)
      return `\n${apiReferenceStub(file, network, generatedDir)}\n`
    }
    const target = embeds.get(text.match(EMBED)?.[1] ?? '')
    if (!target) return text
    if (!isFile(target))
      throw new Error(`${file}: embedded ${target} not found`)
    return markdownOf(target)
  })
  const page = markdown.join('\n').trim() + '\n'
  const titled = lines.some(({ text, fenced }) => !fenced && HEADING.test(text))
  if (networks.length === 0 || titled) return page
  return `# ${pageTitle(file, networks[0], html)}\n\n${page}`
}

function sourceFor(pagesDir: string, route: string): string | undefined {
  const stem = path.join(pagesDir, route)
  return [stem, path.join(stem, 'index')]
    .flatMap(base => SOURCE_EXTENSIONS.map(extension => base + extension))
    .find(isFile)
}

// Page sources in sidebar order: the _meta.json keys first, then the other entries by name.
function orderedSources(dir: string): string[] {
  const listed = Object.keys(readMeta(dir))
  const entries = fs.readdirSync(dir).map(name => name.replace(/\.mdx?$/, ''))
  return [...new Set([...listed, ...entries.sort()])].flatMap(name => {
    const stem = path.join(dir, name)
    const pages = SOURCE_EXTENSIONS.map(ext => stem + ext).filter(isFile)
    const isDirectory = fs
      .statSync(stem, { throwIfNoEntry: false })
      ?.isDirectory()
    return isDirectory ? [...pages, ...orderedSources(stem)] : pages
  })
}

function writeSitemap(outDir: string, urls: string[]): void {
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(url => {
      const loc = url.replace(
        /[&<>"']/g,
        char => XML_ENTITIES.get(char) ?? char
      )
      return `  <url><loc>${loc}</loc></url>`
    }),
    '</urlset>',
    ''
  ].join('\n')
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
}

function writeRobots(outDir: string, host: string): void {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${host}/sitemap.xml\n`
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robots)
}

function writeCorpus(outDir: string, host: string, pages: Page[]): string {
  const corpus = [
    '# Safe Documentation\n',
    `This file contains every documentation page of ${host} in sidebar order.`,
    'A `Source:` line gives the URL of each page.\n',
    ...pages.map(page => `Source: ${page.url}\n\n${page.markdown}`)
  ].join('\n')
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), corpus)
  return corpus
}

function main(pagesDir: string, outDir: string): void {
  const host = (
    process.env.NEXT_PUBLIC_HOST_URL || 'https://docs.safe.global'
  ).replace(/\/+$/, '')
  const routes = (fs.readdirSync(outDir, { recursive: true }) as string[])
    .filter(file => file.endsWith('.html') && file !== '404.html')
    .map(file => file.replace(/\.html$/, ''))
    .sort()
  const urlFor = (route: string) =>
    route === 'index' ? `${host}/` : `${host}/${encodeURI(route)}`
  writeSitemap(outDir, routes.map(urlFor))
  writeRobots(outDir, host)
  const generatedDir = path.resolve(
    pagesDir,
    '../components/ApiReference/generated'
  )

  const pages = new Map<string, Page>()
  for (const route of routes) {
    const source = sourceFor(pagesDir, route)
    if (!source) continue
    const html = path.join(outDir, `${route}.html`)
    const markdown = toMarkdown(source, generatedDir, html)
    fs.writeFileSync(path.join(outDir, `${route}.md`), markdown)
    pages.set(source, { url: urlFor(route), markdown })
  }
  const ordered = orderedSources(pagesDir).flatMap(
    source => pages.get(source) ?? []
  )
  const corpus = writeCorpus(outDir, host, ordered)
  console.info(
    `Wrote sitemap.xml (${routes.length} routes), robots.txt, ${pages.size} .md pages and ` +
      `llms-full.txt (${ordered.length} pages, ${Buffer.byteLength(corpus)} bytes)`
  )
}

try {
  main(process.argv[2] ?? 'pages', process.argv[3] ?? 'out')
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
