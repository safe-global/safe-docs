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
}

// Serves `pages` as the paginated chain list, runs the script in `dir` against it and
// returns its exit code, output and the URLs it requested.
async function run(
  dir: string,
  { status = 200, pages }: ChainList,
  args: string[] = []
) {
  const requests: string[] = []
  const server = createServer((request, response) => {
    requests.push(request.url ?? '')
    const url = new URL(request.url ?? '', base)
    const index = Number(url.searchParams.get('page') ?? 0)
    const next =
      index + 1 < pages.length
        ? `${base}/api/v1/chains/?limit=100&page=${index + 1}`
        : null
    response.writeHead(status, { 'Content-Type': 'application/json' })
    response.end(
      JSON.stringify({
        count: 0,
        next,
        previous: null,
        results: pages.at(index) ?? []
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
      chain(100, 'Gnosis', 'gno', 'https://gnosis.example/tx-service//'),
      ...liveChains.slice(2)
    ]
    const { code, output, requests } = await run(dir, { pages: [chains] })
    assert.equal(code, 0, output)
    assert.equal(requests[0], '/api/v1/chains/?limit=100')
    const networks = readNetworks(dir)
    assert.deepEqual(networks[0], fixtureNetworks[0])
    assert.deepEqual(networks[1], {
      ...fixtureNetworks[1],
      txServiceUrl: 'https://gnosis.example/tx-service'
    })
    const previous = 'https://api.safe.global/tx-service/gno'
    const line = `100 gnosis-chain: ${previous} -> https://gnosis.example/tx-service`
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

test('follows next across pages', () =>
  withTree(async dir => {
    const chains = [...liveChains, chain(42, 'Foo', 'foo')]
    const pages = [chains.slice(0, 2), chains.slice(2, 4), chains.slice(4)]
    const { code, output, requests } = await run(dir, { pages })
    assert.equal(code, 0, output)
    assert.equal(requests.length, 3)
    assert.deepEqual(
      readNetworks(dir).map(n => n.chainId),
      [1, 42, 100, 137, 11155111]
    )
  }))

test('--dry-run prints the summary and changes nothing', () =>
  withTree(async dir => {
    const before = snapshot(dir)
    const chains = [
      chain(1, 'Ethereum', 'eth', 'https://eth.example/'),
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
    assert.match(output, /1 mainnet: .* -> https:\/\/eth\.example/)
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
