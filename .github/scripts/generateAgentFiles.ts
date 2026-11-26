const fs: typeof import('fs') = require('fs')
const path: typeof import('path') = require('path')

const PRODUCTION_HOST = 'https://docs.safe.global'
const SOURCE_EXTENSIONS = ['.mdx', '.md']
const FENCE = /^\s*(`{3,}|~{3,})(.*)$/
const ESM = /^(?:import|export)\s/
const COMMENT_OPEN = /\{\s*\/\*/
const COMMENT_CLOSE = /\*\/\s*\}/
const CODE_SPAN = /(?<!`)(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g
const MDX_IMPORT = /^import\s+(\w+)\s+from\s+['"]([^'"]+\.mdx?)['"]/gm
const COMPONENT_IMPORT =
  /^import\s+(\w+)\s+from\s+['"]([^'"]*\/components\/(\w+))['"]/gm
const EMBED = /^<(\w+)\s*\/>\s*$/
const API_REFERENCE = /^<ApiReference\s+networkName="([^"]+)"\s*\/>\s*$/
const LAYOUT_TAG = /^(\s*)<(\/?)([A-Z][\w.]*)/
const STRING_LITERAL = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g
const STRING_PROP = /(\w+)=\{?\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2/g
const TAB_ITEMS = /\bitems=\{\s*\[([^\]]*)\]/
const BRACES: Record<string, number> = { '{': 1, '}': -1 }
// Layout components whose tags a copy drops, keeping their content.
const LAYOUT_WRAPPERS = [
  'Cards',
  'CH.Code',
  'CH.Section',
  'Container',
  'Grid',
  'Steps',
  'Tabs'
]
const LAYOUT_COMPONENTS = [
  ...LAYOUT_WRAPPERS,
  'Callout',
  'Card',
  'CustomCard',
  'RemovedContentCallout',
  'Tabs.Tab'
]
// Nextra Callout types as GitHub alert types.
const CALLOUT_ALERTS: Record<string, string> = {
  default: 'NOTE',
  info: 'NOTE',
  important: 'IMPORTANT',
  warning: 'WARNING',
  error: 'CAUTION'
}
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
  },
  {
    api: /https:\/\/api\.safe\.global\/queue\//,
    spec: 'openapi.json',
    service: 'Safe Queue Service',
    notes: []
  }
]
const HEADING = /^# /
const HTML_HEAD = /<head[\s>][\s\S]*?<\/head>/
const HTML_TITLE = /<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/
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

interface Tag {
  name: string
  closing: boolean
  selfClosing: boolean
  props: string
  indent: number
  end: number
}

// An open layout component: the column of its content in the copy, and the indent that its
// content loses, taken from its first content line.
interface Wrapper {
  name: string
  column: number
  dedent?: number
  quote: boolean
  drop: boolean
  tabs: string[]
}

interface Layout {
  file: string
  out: Line[]
  stack: Wrapper[]
  gap: boolean
}

interface Network {
  name: string
  chainId: number
  shortName: string
  isTestnet: boolean
  smartAccounts: Array<{ version: string }>
}

interface TxServiceNetwork {
  chainId: number
  txServiceUrl: string
}

interface Resource {
  name: string
  url: string
  type: string
  date: string
  description: string
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

// The text with each inline code span on it blanked out, at the same length.
const outsideCode = (text: string): string =>
  text.replace(CODE_SPAN, span => ' '.repeat(span.length))

// The lines without their {/* … */} comments outside code fences. A comment may span lines; a
// line that only held comments is dropped, and text after a comment loses its leading spaces
// when nothing or a space comes before it. An opener inside an inline code span is text; a
// code span is recognised only within one line, and an escaped backtick still counts as a
// delimiter.
function stripMdxComments(file: string, lines: Line[]): Line[] {
  const stripped: Line[] = []
  let inComment = false
  for (const line of lines) {
    if (line.fenced && !inComment) {
      stripped.push(line)
      continue
    }
    let rest = line.text
    let text = ''
    let removed = inComment
    while (rest !== '') {
      const marker = inComment
        ? COMMENT_CLOSE.exec(rest)
        : COMMENT_OPEN.exec(outsideCode(rest))
      const end = marker ? marker.index : rest.length
      if (!inComment) {
        const segment = rest.slice(0, end)
        text += removed && !/\S$/.test(text) ? segment.trimStart() : segment
      }
      if (!marker) break
      rest = rest.slice(end + marker[0].length)
      inComment = !inComment
      removed = true
    }
    if (!removed) stripped.push(line)
    else if (text.trim() !== '')
      stripped.push({ ...line, text: text.trimEnd() })
  }
  if (inComment) throw new Error(`${file}: an MDX comment is not closed`)
  return stripped
}

const indentOf = (text: string): number => text.length - text.trimStart().length

const isBlank = (line: Line | undefined): boolean =>
  line === undefined || (!line.fenced && line.text.trim() === '')

// The column of the `>` that ends a JSX tag in `text`, or -1. A `>` inside a string or inside
// braces does not end it; `depth` carries the brace depth from line to line.
function tagClose(depth: { value: number }, text: string): number {
  const masked = text.replace(STRING_LITERAL, literal =>
    ' '.repeat(literal.length)
  )
  for (let column = 0; column < masked.length; column++) {
    depth.value += BRACES[masked[column]] ?? 0
    if (masked[column] === '>' && depth.value === 0) return column
  }
  return -1
}

// The open tag that starts in `tag.end` at column `from`, if nothing follows its `>`.
function readOpenTag(
  file: string,
  lines: Line[],
  tag: Tag,
  from: number
): Tag | undefined {
  const depth = { value: 0 }
  let props = ''
  for (let end = tag.end; end < lines.length; end++) {
    const text = end === tag.end ? lines[end].text.slice(from) : lines[end].text
    const close = tagClose(depth, text)
    if (close < 0) {
      props += `${text}\n`
      continue
    }
    if (text.slice(close + 1).trim() !== '') return undefined
    props += text.slice(0, close)
    return { ...tag, props, selfClosing: props.trimEnd().endsWith('/'), end }
  }
  throw new Error(`${file}: the <${tag.name}> tag is not closed`)
}

// The layout component tag that starts on lines[start], if it fills its lines: a close tag
// alone on its line, or an open tag with nothing after its `>`.
function readTag(file: string, lines: Line[], start: number): Tag | undefined {
  const match = LAYOUT_TAG.exec(lines[start].text)
  if (!match || !LAYOUT_COMPONENTS.includes(match[3])) return undefined
  const [opening, indent, slash, name] = match
  const tag = {
    name,
    closing: slash === '/',
    selfClosing: false,
    props: '',
    indent: indent.length,
    end: start
  }
  if (!tag.closing) return readOpenTag(file, lines, tag, opening.length)
  return lines[start].text.trim() === `</${name}>` ? tag : undefined
}

const unescapeString = (value: string): string => value.replace(/\\(.)/g, '$1')

// The string props of a tag: name="…", name='…' and name={'…'}. The first one of a name wins,
// so a prop of a component inside another prop does not replace it.
function stringProps(props: string): Record<string, string> {
  const values: Record<string, string> = {}
  for (const [, name, , value] of props.matchAll(STRING_PROP))
    values[name] ??= unescapeString(value)
  return values
}

const tabItems = (tag: Tag): string[] =>
  [...(TAB_ITEMS.exec(tag.props)?.[1] ?? '').matchAll(STRING_LITERAL)].map(
    ([, , value]) => unescapeString(value)
  )

// The column that a line indented by `indent` takes in the copy: the content of a component
// moves to the column of its tag and keeps its indent relative to its first line.
function contentColumn(stack: Wrapper[], indent: number): number {
  const parent = stack.at(-1)
  if (!parent) return indent
  parent.dedent ??= Math.max(0, indent - parent.column)
  return Math.max(0, indent - parent.dedent)
}

// The text inside a blockquote that starts at `column`.
function quote(text: string, column: number): string {
  if (text.trim() === '') return `${' '.repeat(column)}>`
  const at = Math.min(column, indentOf(text))
  return `${text.slice(0, at)}> ${text.slice(at)}`
}

// The text inside the blockquote of each Callout around it.
const quoted = (stack: Wrapper[], text: string): string =>
  stack.reduceRight(
    (line, wrapper) => (wrapper.quote ? quote(line, wrapper.column) : line),
    text
  )

// Adds a line to the copy. A removed tag or dropped line leaves at most one blank line: `gap`
// marks a removal since the last line that was added.
function pushLine(layout: Layout, line: Line, generated: boolean): void {
  const blank = isBlank(line)
  if (blank && isBlank(layout.out.at(-1)) && (generated || layout.gap)) return
  layout.out.push(line)
  layout.gap = blank && generated
}

const dropped = (layout: Layout): boolean =>
  layout.stack.some(wrapper => wrapper.drop)

// Adds a source line: as written outside the layout components, else moved to its column and
// quoted by each Callout around it. Inside a dropped component it is left out.
function emit(layout: Layout, line: Line): void {
  if (layout.stack.length === 0) return pushLine(layout, line, false)
  if (dropped(layout)) {
    layout.gap = true
    return
  }
  const indent = indentOf(line.text)
  const text =
    line.text.trim() === ''
      ? ''
      : line.text.slice(indent - contentColumn(layout.stack, indent))
  pushLine(layout, { ...line, text: quoted(layout.stack, text) }, false)
}

// Adds a line that stands for a tag at `column`, quoted by each Callout around it.
function emitTagLine(layout: Layout, column: number, text: string): void {
  if (dropped(layout)) return
  const line = text === '' ? '' : ' '.repeat(column) + text
  pushLine(layout, { text: quoted(layout.stack, line), fenced: false }, true)
}

// A card as a list item: its title, linked to its target if it has one, then its description.
function cardItem(
  file: string,
  tag: Tag,
  props: Record<string, string>,
  link: string
): string {
  const { title, description } = props
  if (!title) throw new Error(`${file}: a <${tag.name}> has no title`)
  const name = props[link] ? `[${title}](${props[link]})` : `**${title}**`
  return `- ${name}${description ? `: ${description}` : ''}`
}

// The label of the next tab of the <Tabs> around a <Tabs.Tab>.
function tabLabel(file: string, parent: Wrapper | undefined): string {
  const label = parent?.name === 'Tabs' ? parent.tabs.shift() : undefined
  if (label === undefined)
    throw new Error(`${file}: a <Tabs.Tab> has no item in its <Tabs>`)
  return label
}

// The lines that stand for an open tag in the copy.
function tagLines(file: string, tag: Tag, parent?: Wrapper): string[] {
  const props = stringProps(tag.props)
  switch (tag.name) {
    case 'Callout':
      return ['', `> [!${CALLOUT_ALERTS[props.type ?? 'default'] ?? 'NOTE'}]`]
    case 'Tabs.Tab':
      return ['', `**${tabLabel(file, parent)}**`, '']
    case 'Card':
      return [cardItem(file, tag, props, 'href')]
    case 'CustomCard':
      return [cardItem(file, tag, props, 'url')]
    default:
      return ['']
  }
}

function openTag(layout: Layout, tag: Tag): void {
  const parent = layout.stack.at(-1)
  const column = contentColumn(layout.stack, tag.indent)
  for (const text of tagLines(layout.file, tag, parent))
    emitTagLine(layout, column, text)
  if (tag.selfClosing) return
  layout.stack.push({
    name: tag.name,
    column,
    quote: tag.name === 'Callout',
    drop: tag.name === 'RemovedContentCallout',
    tabs: tabItems(tag)
  })
}

function closeTag(layout: Layout, tag: Tag): void {
  const wrapper = layout.stack.pop()
  if (wrapper?.name !== tag.name)
    throw new Error(`${layout.file}: </${tag.name}> closes no <${tag.name}>`)
  emitTagLine(layout, wrapper.column, '')
}

// The lines of an .mdx file with its layout components unwrapped: wrappers such as Grid, Steps
// and Tabs lose their tags, each tab gets its label, a Callout becomes a GitHub alert, a card
// becomes a list item, and RemovedContentCallout, which the page hides, goes with its content.
// Only a tag that fills its lines counts; any other JSX stays as written.
function unwrapLayout(file: string, lines: Line[]): Line[] {
  const layout: Layout = { file, out: [], stack: [], gap: false }
  for (let index = 0; index < lines.length; index++) {
    const tag = lines[index].fenced ? undefined : readTag(file, lines, index)
    if (!tag) emit(layout, lines[index])
    else layout.gap = true
    if (tag?.closing) closeTag(layout, tag)
    else if (tag) openTag(layout, tag)
    index = tag?.end ?? index
  }
  const open = layout.stack.at(-1)
  if (open) throw new Error(`${file}: <${open.name}> is not closed`)
  return layout.out
}

// MDX reads a line that starts with import or export as JavaScript, up to the first blank
// line where the code is complete. Only .mdx files have MDX comments to drop and layout
// components to unwrap.
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
  return {
    esm,
    lines: file.endsWith('.mdx')
      ? unwrapLayout(file, stripMdxComments(file, lines))
      : lines
  }
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

// The title of a page: its HTML title, else its _meta.json title, else the fallback.
const pageTitle = (file: string, fallback: string, html: string): string =>
  htmlTitle(html) ?? sidebarTitle(file) ?? fallback

// A network name such as arc-testnet as a title: Arc Testnet.
const networkTitle = (network: string): string =>
  network
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

// A component name such as SupportedNetworks as a title: Supported Networks.
const componentTitle = (component: string): string =>
  component.replace(/(?<=[a-z0-9])(?=[A-Z])/g, ' ')

// The parsed JSON data file that a component page renders.
function readData<T>(file: string, data: string): T {
  if (!isFile(data)) throw new Error(`${file}: ${data} not found`)
  return JSON.parse(fs.readFileSync(data, 'utf8')) as T
}

// Text as one Markdown table cell: on one line, with table and inline syntax escaped.
const tableCell = (text: string): string =>
  text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\\`[\]<>|]/g, '\\$&')

// The Markdown that replaces <SupportedNetworks />: a table of the networks with a Safe Smart
// Account deployment, mainnets first, without the deprecated ones.
function supportedNetworksMarkdown(
  file: string,
  componentsDir: string
): string {
  const networks = readData<Network[]>(
    file,
    path.join(componentsDir, 'SupportedNetworks/networks.json')
  )
  const deprecated = new Set(
    readData<Array<{ chainId: number }>>(
      file,
      path.join(componentsDir, 'SupportedNetworks/deprecated-networks.json')
    ).map(network => network.chainId)
  )
  const txServices = new Map(
    readData<TxServiceNetwork[]>(
      file,
      path.join(componentsDir, 'ApiReference/tx-service-networks.json')
    ).map(network => [network.chainId, network.txServiceUrl])
  )
  const rows = networks
    .filter(
      network =>
        !deprecated.has(network.chainId) && network.smartAccounts.length > 0
    )
    .sort(
      (a, b) =>
        Number(a.isTestnet) - Number(b.isTestnet) ||
        a.name.localeCompare(b.name)
    )
    .map(network => {
      const versions = [
        ...new Set(network.smartAccounts.map(account => account.version))
      ].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      const txService = txServices.get(network.chainId) ?? '—'
      return `| ${tableCell(network.name)} | ${network.chainId} | ${tableCell(network.shortName)} | ${versions.join(', ')} | ${txService} |`
    })
  return [
    'Safe Smart Account contracts are deployed on these networks. The interactive list with ' +
      'contract addresses is on the HTML page.\n',
    '| Network | Chain ID | Short name | Safe versions | Transaction Service API |',
    '| --- | --- | --- | --- | --- |',
    ...rows
  ].join('\n')
}

// The Markdown that replaces <ResourceHub />: the Safe team and community resources, each
// newest first.
function resourceHubMarkdown(file: string, componentsDir: string): string {
  const section = (title: string, data: string): string => {
    const items = readData<Resource[]>(
      file,
      path.join(componentsDir, 'ResourceHub', data)
    )
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(resource => {
        const name = resource.name.replace(/[\\[\]]/g, '\\$&')
        // <…> lets the link target hold spaces and parentheses; whitespace, < > and \ cannot
        // appear there, so they are percent-encoded.
        const url = resource.url.replace(/[\s<>\\]/g, encodeURIComponent)
        const description = resource.description.replace(/\s+/g, ' ').trim()
        return `- [${name}](<${url}>) (${resource.type}, ${resource.date}): ${description}`
      })
    return [`## ${title}\n`, ...items].join('\n')
  }
  return [
    section('Safe team resources', 'company-resources.json'),
    section('Community resources', 'community-resources.json')
  ].join('\n\n')
}

// A component that a page imports from components/ → the Markdown that replaces its
// `<Name />` line, because the component renders the page from data files.
const COMPONENT_PAGES: Record<
  string,
  (file: string, componentsDir: string) => string
> = {
  SupportedNetworks: supportedNetworksMarkdown,
  ResourceHub: resourceHubMarkdown
}

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
// `<Name />`, replaces each <ApiReference networkName="…"/> line with a link to its OpenAPI
// spec, and each `<Name />` of a component in COMPONENT_PAGES with its Markdown. Such a page
// without a "# " heading gets its title first.
function toMarkdown(
  file: string,
  componentsDir: string,
  generatedDir: string,
  html: string
): string {
  const { esm, lines } = splitMdx(file)
  const imports = esm.join('\n')
  const embeds = new Map(
    [...imports.matchAll(MDX_IMPORT)].map(([, name, target]) => [
      name,
      path.resolve(path.dirname(file), target)
    ])
  )
  const components = new Map(
    [...imports.matchAll(COMPONENT_IMPORT)]
      .filter(([, , , component]) => Object.hasOwn(COMPONENT_PAGES, component))
      .map(([, name, , component]) => [name, component])
  )
  const titles: string[] = []
  const markdown = lines.map(({ text, fenced }) => {
    if (fenced) return text
    const network = text.match(API_REFERENCE)?.[1]
    if (network) {
      titles.push(networkTitle(network))
      return `\n${apiReferenceStub(file, network, generatedDir)}\n`
    }
    const name = text.match(EMBED)?.[1] ?? ''
    const component = components.get(name)
    if (component) {
      titles.push(componentTitle(component))
      return `\n${COMPONENT_PAGES[component](file, componentsDir)}\n`
    }
    const target = embeds.get(name)
    if (!target) return text
    if (!isFile(target))
      throw new Error(`${file}: embedded ${target} not found`)
    return markdownOf(target)
  })
  const page = markdown.join('\n').trim() + '\n'
  const titled = lines.some(({ text, fenced }) => !fenced && HEADING.test(text))
  if (titles.length === 0 || titled) return page
  return `# ${pageTitle(file, titles[0], html)}\n\n${page}`
}

function sourceFor(pagesDir: string, route: string): string | undefined {
  const stem = path.join(pagesDir, route)
  return [stem, path.join(stem, 'index')]
    .flatMap(base => SOURCE_EXTENSIONS.map(extension => base + extension))
    .find(isFile)
}

// Whether a _meta.json entry hides its page from the sidebar.
const isHidden = (entry: unknown): boolean =>
  (entry as { display?: unknown } | null | undefined)?.display === 'hidden'

// Page sources in sidebar order: the _meta.json keys first, then the other entries by name.
// A hidden entry in the root _meta.json is a navbar tab whose pages stay public; a hidden
// entry in a nested _meta.json leaves out its page and its folder.
function orderedSources(dir: string, nested = false): string[] {
  const meta = readMeta(dir)
  const listed = Object.keys(meta)
  const entries = fs.readdirSync(dir).map(name => name.replace(/\.mdx?$/, ''))
  return [...new Set([...listed, ...entries.sort()])].flatMap(name => {
    if (nested && isHidden(meta[name])) return []
    const stem = path.join(dir, name)
    const pages = SOURCE_EXTENSIONS.map(ext => stem + ext).filter(isFile)
    const isDirectory = fs
      .statSync(stem, { throwIfNoEntry: false })
      ?.isDirectory()
    return isDirectory ? [...pages, ...orderedSources(stem, true)] : pages
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

// Only a build for the production host may be indexed.
function writeRobots(outDir: string, host: string, indexable: boolean): void {
  const robots = indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${host}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n'
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robots)
}

function writeCorpus(outDir: string, host: string, pages: Page[]): string {
  const corpus = [
    '# Safe Documentation\n',
    `This file contains every page listed in the sidebar of ${host}, in sidebar order.`,
    'A `Source:` line gives the URL of each page.\n',
    ...pages.map(page => `Source: ${page.url}\n\n${page.markdown}`)
  ].join('\n')
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), corpus)
  return corpus
}

// The host this build is served from, and whether search engines may index it. Without
// NEXT_PUBLIC_HOST_URL a CI build stops; a local build writes production URLs but a
// robots.txt that disallows crawling. CI counts as set unless it is empty, false or 0.
function buildHost(): { host: string; indexable: boolean } {
  const configured = (process.env.NEXT_PUBLIC_HOST_URL ?? '').replace(
    /\/+$/,
    ''
  )
  if (configured)
    return { host: configured, indexable: configured === PRODUCTION_HOST }
  const ci = process.env.CI
  if (ci && !/^(false|0)$/i.test(ci))
    throw new Error(
      'NEXT_PUBLIC_HOST_URL is not set: set it to the host this build is served from'
    )
  console.warn(
    `NEXT_PUBLIC_HOST_URL is not set: writing ${PRODUCTION_HOST} URLs and a robots.txt that disallows crawling`
  )
  return { host: PRODUCTION_HOST, indexable: false }
}

function main(pagesDir: string, outDir: string): void {
  const { host, indexable } = buildHost()
  const routes = (fs.readdirSync(outDir, { recursive: true }) as string[])
    .filter(file => file.endsWith('.html') && file !== '404.html')
    .map(file => file.replace(/\.html$/, ''))
    .sort()
  const urlFor = (route: string) =>
    route === 'index' ? `${host}/` : `${host}/${encodeURI(route)}`
  const sources = new Map(
    routes.map(route => [route, sourceFor(pagesDir, route)])
  )
  const listed = new Set(orderedSources(pagesDir))
  const indexed = routes.filter(route => {
    const source = sources.get(route)
    return !source || listed.has(source)
  })
  writeSitemap(outDir, indexed.map(urlFor))
  writeRobots(outDir, host, indexable)
  const componentsDir = path.resolve(pagesDir, '../components')
  const generatedDir = path.join(componentsDir, 'ApiReference/generated')

  const pages = new Map<string, Page>()
  for (const [route, source] of sources) {
    if (!source) continue
    const html = path.join(outDir, `${route}.html`)
    const markdown = toMarkdown(source, componentsDir, generatedDir, html)
    fs.writeFileSync(path.join(outDir, `${route}.md`), markdown)
    pages.set(source, { url: urlFor(route), markdown })
  }
  const ordered = [...listed].flatMap(source => pages.get(source) ?? [])
  const corpus = writeCorpus(outDir, host, ordered)
  console.info(
    `Wrote sitemap.xml (${indexed.length} routes), robots.txt, ${pages.size} .md pages and ` +
      `llms-full.txt (${ordered.length} pages, ${Buffer.byteLength(corpus)} bytes)`
  )
}

try {
  main(process.argv[2] ?? 'pages', process.argv[3] ?? 'out')
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
