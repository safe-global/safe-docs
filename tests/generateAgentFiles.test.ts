/* eslint-disable security/detect-non-literal-fs-filename -- uses only a temporary copy */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
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

const apiReferencePage = (network: string) =>
  "import ApiReference from '../components/ApiReference'\n\n" +
  '{/* <!-- vale off --> */}\n' +
  `<ApiReference networkName="${network}"/>\n` +
  '{/* <!-- vale on --> */}\n'

// Writes the generated API reference of a network, which names the API URLs.
const addReference = (network: string, text: string) => (dir: string) => {
  const generatedDir = path.join(dir, 'components/ApiReference/generated')
  mkdirSync(generatedDir, { recursive: true })
  writeFileSync(path.join(generatedDir, `${network}-reference.mdx`), text)
}

const YAML_NOTE = 'The spec URL answers YAML; add ?format=json for JSON.\n\n'
const TX_SERVICE = 'Safe Transaction Service'
const MAINNET_SPEC = 'https://api.safe.global/tx-service/eth/schema/'

// The text that replaces an <ApiReference networkName="…"/> line.
const specText = (service: string, spec: string, note = '') =>
  `This page is the ${service} API reference.\n\n` +
  `The full reference of this API is its OpenAPI spec:\n${spec}\n\n${note}` +
  'The spec needs no API key.'

// The Markdown copy of an apiReferencePage, which has no heading.
const specPage = (title: string, text: string) => `# ${title}\n\n${text}\n`

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

test('starts llms-full.txt with a header that names the host', () => {
  const corpus = generated().get('llms-full.txt') ?? ''
  assert.ok(
    corpus.startsWith(
      '# Safe Documentation\n\nThis file contains every page listed in the sidebar of ' +
        'https://docs.safe.global, in sidebar order.\n' +
        'A `Source:` line gives the URL of each page.\n\n'
    ),
    corpus
  )
})

test('leaves pages hidden in a nested _meta.json out of sitemap.xml and llms-full.txt', () => {
  const files = generated({
    change: dir => {
      const editMeta = (file: string, entries: Record<string, unknown>) => {
        const meta = path.join(dir, 'pages', file)
        const current = JSON.parse(readFileSync(meta, 'utf8'))
        writeFileSync(meta, JSON.stringify({ ...current, ...entries }))
      }
      editMeta('_meta.json', {
        about: { title: 'About', type: 'page', display: 'hidden' }
      })
      editMeta('guide/_meta.json', {
        install: { display: 'hidden' },
        secret: { type: 'page', display: 'hidden' }
      })
      mkdirSync(path.join(dir, 'pages/guide/secret'))
      mkdirSync(path.join(dir, 'built/guide/secret'))
      addPage('guide/secret/page', '# Secret\n\nA hidden page.\n')(dir)
    }
  })
  const sitemap = files.get('sitemap.xml') ?? ''
  const corpus = files.get('llms-full.txt') ?? ''
  for (const route of ['guide/install', 'guide/secret/page']) {
    const url = `https://docs.safe.global/${route}`
    assert.ok(!sitemap.includes(`<loc>${url}</loc>`), route)
    assert.ok(!corpus.includes(`Source: ${url}\n`), route)
    assert.ok(files.has(`${route}.md`), route)
  }
  assert.equal(
    files.get('guide/secret/page.md'),
    '# Secret\n\nA hidden page.\n'
  )
  const about = 'https://docs.safe.global/about'
  assert.ok(sitemap.includes(`<loc>${about}</loc>`))
  assert.ok(corpus.includes(`Source: ${about}\n`))
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

test('drops MDX comments in both brace forms, inline and over several lines', () => {
  const source =
    '{/* <!-- vale off --> */}\n# Comments\n{ /* <!-- vale on --> */ }\n\n' +
    'A {/* x */} B and C{ /* y */}D.\n\n' +
    'Before {/* a comment\nover three\nlines */} after.\n\n' +
    '  {/* only */}  {/* comments */}\n' +
    'End.\n'
  const files = generated({ change: addPage('comments', source) })
  assert.equal(
    files.get('comments.md'),
    '# Comments\n\nA B and CD.\n\nBefore\nafter.\n\nEnd.\n'
  )
})

test('keeps MDX comments inside code fences and in .md pages', () => {
  const fenced = '# Fenced\n\n```mdx\n{/* kept */}\n```\n'
  const plain = '# Plain\n\n{/* kept */}\n'
  const files = generated({
    change: dir => {
      addPage('fenced', fenced)(dir)
      addPage('plain', plain, '.md')(dir)
    }
  })
  assert.equal(files.get('fenced.md'), fenced)
  assert.equal(files.get('plain.md'), plain)
})

test('drops MDX comments in an embedded .mdx file', () => {
  const page =
    "import Commented from '../components/commented.mdx'\n\n# Embed\n\n<Commented />\n"
  const files = generated({
    change: dir => {
      writeFileSync(
        path.join(dir, 'components/commented.mdx'),
        '{/* hidden */}\nShown text.\n'
      )
      addPage('embed', page)(dir)
    }
  })
  assert.equal(files.get('embed.md'), '# Embed\n\nShown text.\n')
})

test('stops with the page path when an MDX comment is not closed', () => {
  const source = '# Open comment\n\n{/* never closed\n\nText.\n'
  const { status, output } = generate({ change: addPage('unclosed', source) })
  assert.equal(status, 1, output)
  assert.match(output, /pages\/unclosed\.mdx: an MDX comment is not closed/)
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

test('writes an OpenAPI spec stub for a transaction service reference page', () => {
  const fenced =
    '# Sample\n\n```mdx\n<ApiReference networkName="mainnet"/>\n```\n'
  const files = generated({
    change: dir => {
      addPage('arc-testnet', apiReferencePage('arc-testnet'))(dir)
      addReference(
        'arc-testnet',
        'curl https://api.safe.global/tx-service/arc-testnet/api/v1/safes/\n' +
          'curl https://api.safe.global/tx-service/eth/api/v1/about/\n'
      )(dir)
      addPage('fenced', fenced)(dir)
    }
  })
  const spec = 'https://api.safe.global/tx-service/arc-testnet/schema/'
  const stub = specPage('Arc Testnet', specText(TX_SERVICE, spec, YAML_NOTE))
  assert.equal(files.get('arc-testnet.md'), stub)
  const section = `\nSource: https://docs.safe.global/arc-testnet\n\n${stub}`
  assert.ok(files.get('llms-full.txt')?.includes(section))
  assert.equal(files.get('fenced.md'), fenced)
})

test('takes the spec of the API URL that comes first in the reference', () => {
  const decoder = 'curl https://api.safe.global/decoder/api/v1/contracts\n'
  const tx = 'curl https://api.safe.global/tx-service/eth/api/v1/about/\n'
  const files = generated({
    change: dir => {
      addPage('decoder-first', apiReferencePage('decoder-first'))(dir)
      addReference('decoder-first', decoder + tx)(dir)
      addPage('tx-first', apiReferencePage('tx-first'))(dir)
      addReference('tx-first', tx + decoder)(dir)
    }
  })
  const decoderSpec = 'https://api.safe.global/decoder/openapi.json'
  assert.equal(
    files.get('decoder-first.md'),
    specPage('Decoder First', specText('Safe Decoder Service', decoderSpec))
  )
  assert.equal(
    files.get('tx-first.md'),
    specPage('Tx First', specText(TX_SERVICE, MAINNET_SPEC, YAML_NOTE))
  )
})

test('replaces only the ApiReference lines and keeps the rest of the page', () => {
  const prose =
    '# Prose\n\nRead this first.\n\n<ApiReference networkName="mainnet"/>\n\nThen this.\n'
  const twice =
    'Two networks.\n\n```sh\n# not a heading\n```\n' +
    '<ApiReference networkName="mainnet"/>\n' +
    '<ApiReference networkName="safe-decoder-service"/>\n'
  const files = generated({
    change: dir => {
      addPage('prose', prose)(dir)
      addPage('twice', twice)(dir)
      addReference('mainnet', 'https://api.safe.global/tx-service/eth/\n')(dir)
      addReference(
        'safe-decoder-service',
        'https://api.safe.global/decoder/api/v1/contracts\n'
      )(dir)
    }
  })
  const tx = specText(TX_SERVICE, MAINNET_SPEC, YAML_NOTE)
  const decoder = specText(
    'Safe Decoder Service',
    'https://api.safe.global/decoder/openapi.json'
  )
  assert.equal(
    files.get('prose.md'),
    `# Prose\n\nRead this first.\n\n\n${tx}\n\n\nThen this.\n`
  )
  assert.equal(
    files.get('twice.md'),
    '# Mainnet\n\nTwo networks.\n\n```sh\n# not a heading\n```\n\n' +
      `${tx}\n\n\n${decoder}\n`
  )
})

test('takes the stub title from the built page, then _meta.json, then the network', () => {
  const pages = new Map([
    [
      'decoder',
      '<html><head><title>Safe Decoder Service Reference – Safe Docs</title></head>' +
        '<body><svg><title>GitHub</title></svg></body></html>'
    ],
    [
      'coded',
      '<head><title>A &amp; B<!-- --> &lt;C&gt; &quot;D&quot; &#39;E&#39; – Safe Docs' +
        '</title></head>'
    ],
    ['about', '<head><title></title></head>'],
    [
      'nexthead',
      '<head><meta charSet="utf-8" data-next-head=""/>' +
        '<title data-next-head="">Next<!-- --> Head – Safe Docs</title></head>'
    ],
    ['listed', '<head></head><body><svg><title>GitHub</title></svg></body>']
  ])
  const files = generated({
    change: dir => {
      const meta = path.join(dir, 'pages/_meta.json')
      const entries = JSON.parse(readFileSync(meta, 'utf8'))
      const titles = {
        decoder: { title: 'Reference' },
        listed: { title: 'Listed Reference' }
      }
      writeFileSync(meta, JSON.stringify({ ...entries, ...titles }))
      for (const [page, html] of pages) {
        addPage(page, apiReferencePage('mainnet'))(dir)
        writeFileSync(path.join(dir, `built/${page}.html`), html)
      }
      addReference('mainnet', 'https://api.safe.global/tx-service/eth/\n')(dir)
    }
  })
  const tx = specText(TX_SERVICE, MAINNET_SPEC, YAML_NOTE)
  for (const [page, title] of [
    ['decoder', 'Safe Decoder Service Reference'],
    ['coded', `A & B <C> "D" 'E'`],
    ['about', 'About'],
    ['nexthead', 'Next Head'],
    ['listed', 'Listed Reference']
  ]) {
    assert.equal(files.get(`${page}.md`), specPage(title, tx), page)
  }
})

test('stops with the page path when no OpenAPI spec URL can be derived', () => {
  const reference = 'components/ApiReference/generated/gone-reference.mdx'
  for (const [change, reason] of [
    [
      addReference('gone', 'See https://docs.safe.global.\n'),
      'names no API URL for an OpenAPI spec'
    ],
    [() => undefined, 'not found']
  ] as const) {
    const { status, output } = generate({
      change: dir => {
        addPage('gone', apiReferencePage('gone'))(dir)
        change(dir)
      }
    })
    assert.equal(status, 1, output)
    const line = output
      .split('\n')
      .find(text => text.includes('/pages/gone.mdx: '))
    assert.ok(line?.endsWith(`/${reference} ${reason}`), output)
  }
})

const componentPage = (component: string) =>
  `import ${component} from '../components/${component}'\n\n<${component} />\n`

test('writes the supported networks table for a SupportedNetworks page', () => {
  const files = generated({
    change: dir => {
      const meta = path.join(dir, 'pages/_meta.json')
      const entries = JSON.parse(readFileSync(meta, 'utf8'))
      const networks = {
        title: 'Smart Account Networks',
        theme: { layout: 'raw' }
      }
      writeFileSync(meta, JSON.stringify({ ...entries, networks }))
      addPage('networks', componentPage('SupportedNetworks'))(dir)
    }
  })
  assert.equal(
    files.get('networks.md'),
    '# Smart Account Networks\n\n' +
      'Safe Smart Account contracts are deployed on these networks. The interactive list ' +
      'with contract addresses is on the HTML page.\n\n' +
      '| Network | Chain ID | Short name | Safe versions | Transaction Service API |\n' +
      '| --- | --- | --- | --- | --- |\n' +
      '| Arbitrum \\| One | 42161 | arb1 | v1.10.0, v1.9.0 | — |\n' +
      '| Ethereum Mainnet | 1 | eth | v1.4.1, v1.3.0 | https://api.safe.global/tx-service/eth |\n' +
      '| Sepolia | 11155111 | sep | v1.4.1 | — |\n'
  )
})

test('writes the resource lists for a ResourceHub page', () => {
  const files = generated({
    change: addPage('hub', componentPage('ResourceHub'))
  })
  assert.equal(
    files.get('hub.md'),
    '# Resource Hub\n\n## Safe team resources\n\n' +
      '- [Newer team post](https://example.com/newer) (Blog Post, 2024-05-02): A newer post.\n' +
      '- [Older [team\\] talk](https://example.com/older) (Video, 2023-01-10): ' +
      'An older talk by the team.\n\n' +
      '## Community resources\n\n' +
      '- [Community podcast](https://example.com/podcast) (Podcast, 2023-11-20): A podcast.\n' +
      '- [Community guide](https://example.com/guide) (Blog Post, 2022-03-01): A guide.\n'
  )
})

test('keeps the line of a component that has no markdown copy', () => {
  const source =
    "import Other from '../components/Other'\n\n# Other\n\n<Other />\n"
  const files = generated({ change: addPage('other', source) })
  assert.equal(files.get('other.md'), '# Other\n\n<Other />\n')
})

test('stops with the page path when a component data file is missing', () => {
  const { status, output } = generate({
    change: dir => {
      rmSync(path.join(dir, 'components/ResourceHub/community-resources.json'))
      addPage('hub', componentPage('ResourceHub'))(dir)
    }
  })
  assert.equal(status, 1, output)
  const line = output
    .split('\n')
    .find(text => text.includes('/pages/hub.mdx: '))
  assert.ok(
    line?.endsWith(
      '/components/ResourceHub/community-resources.json not found'
    ),
    output
  )
})

test('writes robots.txt that allows crawling and names the sitemap on production', () => {
  const robots =
    'User-agent: *\nAllow: /\n\nSitemap: https://docs.safe.global/sitemap.xml\n'
  assert.equal(generated().get('robots.txt'), robots)
  assert.equal(
    generated({ host: 'https://docs.safe.global/' }).get('robots.txt'),
    robots
  )
})

test('writes robots.txt that disallows crawling on any other host', () => {
  const robots = generated({ host: 'https://docs.staging.example/' }).get(
    'robots.txt'
  )
  assert.equal(robots, 'User-agent: *\nDisallow: /\n')
})
