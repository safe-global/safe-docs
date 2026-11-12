/* eslint-disable security/detect-non-literal-fs-filename -- uses only a temporary directory */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import {
  existsSync,
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
  '../.github/scripts/generateTxServiceNetworks.ts'
)
const NETWORKS_FILE = 'components/ApiReference/tx-service-networks.json'

interface Network {
  chainId: number
  shortName: string
  networkName: string
  txServiceUrl: string
}

interface Chain {
  chainId: string
  chainName: string
  shortName: string
  transactionService: string | null
}

const fixtureNetworks: Network[] = [
  network(1, 'eth', 'mainnet'),
  network(100, 'gno', 'gnosis-chain'),
  network(137, 'pol', 'polygon'),
  network(11155111, 'sep', 'sepolia')
]

function network(
  chainId: number,
  shortName: string,
  networkName: string
): Network {
  const txServiceUrl = `https://api.safe.global/tx-service/${shortName}`
  return { chainId, shortName, networkName, txServiceUrl }
}

function chain(
  chainId: number,
  chainName: string,
  shortName: string,
  transactionService:
    | string
    | null = `https://api.safe.global/tx-service/${shortName}/`
): Chain {
  return { chainId: String(chainId), chainName, shortName, transactionService }
}

const liveChains = [
  chain(1, 'Ethereum', 'eth'),
  chain(100, 'Gnosis Chain', 'gno'),
  chain(137, 'Polygon', 'pol'),
  chain(11155111, 'Sepolia', 'sep')
]

const generatedPaths = (name: string): string[] => [
  `pages/core-api/transaction-service-reference/${name}.mdx`,
  `components/ApiReference/generated/${name}-reference.mdx`,
  `components/ApiReference/schemas/${name}-swagger.json`,
  `components/ApiReference/examples/${name}`
]

function createTree(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'tx-service-networks-'))
  const write = (file: string, content: string) => {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    writeFileSync(path.join(dir, file), content)
  }
  write(NETWORKS_FILE, JSON.stringify(fixtureNetworks, null, 2) + '\n')
  for (const { networkName } of fixtureNetworks) {
    const [page, reference, schema, examples] = generatedPaths(networkName)
    write(page, `# ${networkName}\n`)
    write(reference, `# ${networkName} reference\n`)
    write(schema, '{}\n')
    write(path.join(examples, 'get-safe.ts'), '// example\n')
  }
  return dir
}

function snapshot(dir: string): Map<string, string> {
  return new Map(
    readdirSync(dir, { recursive: true, encoding: 'utf8' })
      .filter(file => statSync(path.join(dir, file)).isFile())
      .sort()
      .map(file => [file, readFileSync(path.join(dir, file), 'utf8')])
  )
}

const readNetworks = (dir: string): Network[] =>
  JSON.parse(readFileSync(path.join(dir, NETWORKS_FILE), 'utf8'))

interface ChainList {
  status?: number
  pages: Chain[][]
  // Replaces the `next` URL whenever more pages exist.
  next?: string
  // Answers every request with a non-null `next`.
  endless?: boolean
}

// Serves `pages` by offset as the paginated chain list, runs the script in `dir` against
// it and returns its exit code, output and the URLs it requested.
async function run(
  dir: string,
  { status = 200, pages, next: nextUrl, endless = false }: ChainList,
  args: string[] = []
) {
  const requests: string[] = []
  const offsets = pages.map((_, i) => pages.slice(0, i).flat().length)
  const server = createServer((request, response) => {
    requests.push(request.url ?? '')
    const url = new URL(request.url ?? '', base)
    const index = offsets.indexOf(Number(url.searchParams.get('offset')))
    const more = endless || (index !== -1 && index + 1 < pages.length)
    const next = more
      ? (nextUrl ?? `${base}/api/v1/chains/?cursor=${index + 1}`)
      : null
    response.writeHead(status, { 'Content-Type': 'application/json' })
    response.end(
      JSON.stringify({
        count: 0,
        next,
        previous: null,
        results: index === -1 ? [] : pages[index]
      })
    )
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  try {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: dir,
      env: { ...process.env, SAFE_CONFIG_SERVICE_URL: base }
    })
    let output = ''
    child.stdout.on('data', chunk => (output += chunk))
    child.stderr.on('data', chunk => (output += chunk))
    const code = await new Promise<number | null>(resolve =>
      child.on('close', resolve)
    )
    return { code, output, requests }
  } finally {
    server.close()
  }
}

async function withTree(body: (dir: string) => Promise<void>) {
  const dir = createTree()
  try {
    await body(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test('refreshes txServiceUrl, keeps the names and strips the trailing slash', () =>
  withTree(async dir => {
    const chains = [
      chain(
        1,
        'Ethereum',
        'ethereum',
        'https://api.safe.global/tx-service/eth/'
      ),
      chain(100, 'Gnosis', 'gno', 'https://api.safe.global/tx-service/gnosis/'),
      ...liveChains.slice(2)
    ]
    const { code, output, requests } = await run(dir, { pages: [chains] })
    assert.equal(code, 0, output)
    assert.deepEqual(requests, ['/api/v1/chains/?limit=100&offset=0'])
    const networks = readNetworks(dir)
    assert.deepEqual(networks[0], fixtureNetworks[0])
    const txServiceUrl = 'https://api.safe.global/tx-service/gnosis'
    assert.deepEqual(networks[1], { ...fixtureNetworks[1], txServiceUrl })
    const previous = 'https://api.safe.global/tx-service/gno'
    const line = `100 gnosis-chain: ${previous} -> ${txServiceUrl}`
    assert.ok(output.includes(line), output)
    assert.doesNotMatch(output, /Added|Removed/)
  }))

test('adds a new chain with a derived networkName in chainId order', () =>
  withTree(async dir => {
    const chains = [...liveChains, chain(42, '#Foo Chain (Beta)!', 'foo')]
    const { code, output } = await run(dir, { pages: [chains] })
    assert.equal(code, 0, output)
    const networks = readNetworks(dir)
    assert.deepEqual(
      networks.map(n => n.chainId),
      [1, 42, 100, 137, 11155111]
    )
    assert.deepEqual(networks[1], {
      chainId: 42,
      shortName: 'foo',
      networkName: 'foo-chain-beta',
      txServiceUrl: 'https://api.safe.global/tx-service/foo'
    })
    assert.match(output, /42 #Foo Chain \(Beta\)! -> foo-chain-beta/)
    assert.match(output, /becomes the page URL/)
  }))

test('drops a removed chain and deletes only its generated files', () =>
  withTree(async dir => {
    const before = snapshot(dir)
    const chains = liveChains.filter(c => c.shortName !== 'pol')
    const { code, output } = await run(dir, { pages: [chains] })
    assert.equal(code, 0, output)
    assert.deepEqual(
      readNetworks(dir).map(n => n.networkName),
      ['mainnet', 'gnosis-chain', 'sepolia']
    )
    for (const file of generatedPaths('polygon')) {
      assert.equal(existsSync(path.join(dir, file)), false, file)
      assert.ok(output.includes(`deleted ${file}`), output)
    }
    const after = snapshot(dir)
    for (const [file, content] of before)
      if (!file.includes('polygon') && file !== NETWORKS_FILE)
        assert.equal(after.get(file), content, file)
  }))

test('pages by offset on the configured URL and never requests next', async () => {
  const elsewhere: string[] = []
  const other = createServer((request, response) => {
    elsewhere.push(request.url ?? '')
    response.end()
  })
  await new Promise<void>(resolve => other.listen(0, '127.0.0.1', resolve))
  const { port } = other.address() as AddressInfo
  try {
    await withTree(async dir => {
      const chains = [...liveChains, chain(42, 'Foo', 'foo')]
      const pages = [chains.slice(0, 2), chains.slice(2, 4), chains.slice(4)]
      const next = `http://127.0.0.1:${port}/api/v1/chains/?offset=2`
      const { code, output, requests } = await run(dir, { pages, next })
      assert.equal(code, 0, output)
      assert.deepEqual(
        requests,
        [0, 2, 4].map(offset => `/api/v1/chains/?limit=100&offset=${offset}`)
      )
      assert.deepEqual(elsewhere, [])
      assert.deepEqual(
        readNetworks(dir).map(n => n.chainId),
        [1, 42, 100, 137, 11155111]
      )
    })
  } finally {
    other.close()
  }
})

test('--dry-run prints the summary and changes nothing', () =>
  withTree(async dir => {
    const before = snapshot(dir)
    const chains = [
      chain(1, 'Ethereum', 'eth', 'https://api.safe.global/tx-service/mainnet'),
      chain(42, 'Foo', 'foo'),
      ...liveChains.slice(1, 2),
      ...liveChains.slice(3)
    ]
    const { code, output } = await run(dir, { pages: [chains] }, ['--dry-run'])
    assert.equal(code, 0, output)
    assert.match(output, /42 Foo -> foo/)
    assert.match(
      output,
      /would delete components\/ApiReference\/examples\/polygon/
    )
    assert.match(
      output,
      /1 mainnet: .* -> https:\/\/api\.safe\.global\/tx-service\/mainnet\n/
    )
    assert.match(output, /Dry run/)
    assert.deepEqual(snapshot(dir), before)
  }))

const aborts: Array<[string, ChainList, RegExp]> = [
  ['a non-200 response', { status: 500, pages: [liveChains] }, /answered 500/],
  ['an empty chain list', { pages: [[]] }, /no chains/],
  [
    'a chain without transactionService',
    { pages: [[...liveChains, chain(42, 'Foo', 'foo', null)]] },
    /No transactionService for chain 42/
  ],
  ...[
    'http://api.safe.global/tx-service/foo',
    'https://api.safe.global.example.com/tx-service/foo',
    'https://evil.example/tx-service/foo',
    'https://user:pass@api.safe.global/tx-service/foo',
    'https://api.safe.global:8443/tx-service/foo',
    'https://api.safe.global/tx-service/foo?x=1',
    'https://api.safe.global/tx-service/foo#x',
    'https://api.safe.global/tx-service/foo/extra',
    'https://api.safe.global/tx-service/fo`o',
    'not a url'
  ].map((url): [string, ChainList, RegExp] => [
    `transactionService ${url}`,
    { pages: [[...liveChains, chain(42, 'Foo', 'foo', url)]] },
    /Chain 42 has an invalid transactionService/
  ]),
  [
    'an invalid existing chain transactionService',
    {
      pages: [
        [
          chain(1, 'Ethereum', 'eth', 'https://eth.example/'),
          ...liveChains.slice(1)
        ]
      ]
    },
    /Chain 1 has an invalid transactionService "https:\/\/eth\.example\/"/
  ],
  [
    'a non-numeric chainId',
    {
      pages: [[...liveChains, { ...chain(42, 'Foo', 'foo'), chainId: '4x2' }]]
    },
    /Invalid chainId "4x2"/
  ],
  [
    'a chainId returned twice across pages',
    { pages: [liveChains.slice(0, 2), liveChains.slice(1)] },
    /returned chain 100 twice \(a paging problem\)/
  ],
  [
    'an empty page that claims more results',
    { pages: [liveChains], endless: true },
    /returned no chains but claims more/
  ],
  [
    'a slug that collides with an existing networkName',
    { pages: [[...liveChains, chain(42, 'Mainnet', 'mn')]] },
    /"mainnet".*already taken/
  ],
  [
    'two new chains with the same slug',
    {
      pages: [
        [...liveChains, chain(42, 'Foo One', 'f1'), chain(43, 'foo-one', 'f2')]
      ]
    },
    /"foo-one".*already taken/
  ],
  [
    'removing the sep entry',
    { pages: [liveChains.filter(c => c.shortName !== 'sep')] },
    /Refusing to remove sepolia/
  ]
]

for (const [name, response, message] of aborts)
  test(`aborts on ${name} and leaves the tree unchanged`, () =>
    withTree(async dir => {
      const before = snapshot(dir)
      const { code, output } = await run(dir, response)
      assert.notEqual(code, 0, output)
      assert.match(output, message)
      assert.deepEqual(snapshot(dir), before)
    }))

// Listed in EXCLUDED_CHAIN_IDS in the script.
const excluded = (transactionService?: string | null): Chain =>
  chain(42424242, 'Getherium Testnet', 'gth', transactionService)

test('skips an excluded chain and reports it', () =>
  withTree(async dir => {
    const before = snapshot(dir)
    const { code, output } = await run(dir, {
      pages: [[...liveChains, excluded()]]
    })
    assert.equal(code, 0, output)
    assert.deepEqual(snapshot(dir), before)
    assert.match(output, /Already up to date\./)
    assert.ok(
      output.includes(
        'Skipped 1 excluded chain(s):\n  42424242 Getherium Testnet\n'
      ),
      output
    )
    assert.doesNotMatch(output, /Added/)
  }))

test('does not validate the transactionService of an excluded chain', () =>
  withTree(async dir => {
    const before = snapshot(dir)
    for (const transactionService of [null, 'https://evil.example/']) {
      const pages = [[...liveChains, excluded(transactionService)]]
      const { code, output } = await run(dir, { pages })
      assert.equal(code, 0, output)
      assert.match(output, /42424242 Getherium Testnet/)
    }
    assert.deepEqual(snapshot(dir), before)
  }))

test('a second run is a no-op', () =>
  withTree(async dir => {
    const pages = [[...liveChains.slice(1), chain(42, 'Foo', 'foo')]]
    assert.equal((await run(dir, { pages })).code, 0)
    const before = snapshot(dir)
    const { code, output } = await run(dir, { pages })
    assert.equal(code, 0, output)
    assert.match(output, /Already up to date/)
    assert.deepEqual(snapshot(dir), before)
  }))
