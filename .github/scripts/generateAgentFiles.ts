/* eslint-disable @typescript-eslint/no-require-imports -- ts-node runs the scripts as CommonJS */
/* eslint-disable security/detect-non-literal-fs-filename -- reads pages/ and writes out/ */
const fs: typeof import('fs') = require('fs')
const path: typeof import('path') = require('path')

const SOURCE_EXTENSIONS = ['.mdx', '.md']
const FENCE = /^\s*(`{3,}|~{3,})(.*)$/
const ESM = /^(?:import|export)\s/
const MDX_IMPORT = /^import\s+(\w+)\s+from\s+['"]([^'"]+\.mdx?)['"]/gm
const EMBED = /^<(\w+)\s*\/>\s*$/
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
// ponytail: "complete" means balanced brackets. A bracket in a string or a comment, or a blank
// line in a template literal, breaks it; brackets that never balance stop the build.
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

// Inlines one level of the .mdx files that the page imports and embeds as `<Name />`.
function toMarkdown(file: string): string {
  const { esm, lines } = splitMdx(file)
  const embeds = new Map(
    [...esm.join('\n').matchAll(MDX_IMPORT)].map(([, name, target]) => [
      name,
      path.resolve(path.dirname(file), target)
    ])
  )
  const markdown = lines.map(({ text, fenced }) => {
    const target = fenced ? undefined : embeds.get(text.match(EMBED)?.[1] ?? '')
    if (!target) return text
    if (!isFile(target))
      throw new Error(`${file}: embedded ${target} not found`)
    return markdownOf(target)
  })
  return markdown.join('\n').trim() + '\n'
}

function sourceFor(pagesDir: string, route: string): string | undefined {
  const stem = path.join(pagesDir, route)
  return [stem, path.join(stem, 'index')]
    .flatMap(base => SOURCE_EXTENSIONS.map(extension => base + extension))
    .find(isFile)
}

// Page sources in sidebar order: the _meta.json keys first, then the other entries by name.
function orderedSources(dir: string): string[] {
  const meta = path.join(dir, '_meta.json')
  const listed = isFile(meta)
    ? Object.keys(JSON.parse(fs.readFileSync(meta, 'utf8')))
    : []
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

  const pages = new Map<string, Page>()
  for (const route of routes) {
    const source = sourceFor(pagesDir, route)
    if (!source) continue
    const markdown = toMarkdown(source)
    fs.writeFileSync(path.join(outDir, `${route}.md`), markdown)
    pages.set(source, { url: urlFor(route), markdown })
  }
  const ordered = orderedSources(pagesDir).flatMap(
    source => pages.get(source) ?? []
  )
  const corpus = writeCorpus(outDir, host, ordered)
  console.info(
    `Wrote sitemap.xml (${routes.length} routes), ${pages.size} .md pages and ` +
      `llms-full.txt (${ordered.length} pages, ${Buffer.byteLength(corpus)} bytes)`
  )
}

try {
  main(process.argv[2] ?? 'pages', process.argv[3] ?? 'out')
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
