const fs: typeof import('fs') = require('fs')

const NETWORKS_FILE = 'components/ApiReference/tx-service-networks.json'
const CONFIG_SERVICE_URL =
  process.env.SAFE_CONFIG_SERVICE_URL ?? 'https://safe-config.safe.global'
// generateApiReference.ts builds the shared API reference from this network.
const REQUIRED_SHORT_NAME = 'sep'
const SAFE_NAME = /^[\w-]+$/
// generate-api-reference sends the API key to txServiceUrl, so only Safe's own host is accepted.
const TX_SERVICE_HOST = 'api.safe.global'
const TX_SERVICE_PATH = /^\/tx-service\/([\w-]+)\/?$/
const PAGE_SIZE = 100
const MAX_PAGES = 50
// Chains the Config Service lists that the docs do not publish yet; delete an entry to
// publish it on the next sync. An excluded chain still in NETWORKS_FILE is removed.
const EXCLUDED_CHAIN_IDS = new Set([
  42424242 // Getherium Testnet
])

interface TxServiceNetwork {
  chainId: number
  shortName: string
  networkName: string
  txServiceUrl: string
}

interface ConfigChain {
  chainId: string | number
  chainName: string
  shortName: string
  transactionService?: string | null
}

interface ChainPage {
  next: string | null
  results: ConfigChain[]
}

interface Sync {
  networks: TxServiceNetwork[]
  added: Array<{ network: TxServiceNetwork; chainName: string }>
  removed: TxServiceNetwork[]
  changed: Array<{ network: TxServiceNetwork; previousUrl: string }>
  skipped: Array<{ chainId: number; chainName: string }>
}

const slug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const generatedPaths = (networkName: string): string[] => [
  `pages/core-api/transaction-service-reference/${networkName}.mdx`,
  `components/ApiReference/generated/${networkName}-reference.mdx`,
  `components/ApiReference/schemas/${networkName}-swagger.json`,
  `components/ApiReference/examples/${networkName}`
]

function parseChainId(value: string | number): number {
  const chainId = /^\d+$/.test(String(value)) ? Number(value) : NaN
  if (!Number.isSafeInteger(chainId) || chainId <= 0)
    throw new Error(`Invalid chainId ${JSON.stringify(value)}`)
  return chainId
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function parseTxServiceUrl(chainId: number, value: string): string {
  const url = parseUrl(value)
  const path = url?.pathname.match(TX_SERVICE_PATH)
  if (
    !url ||
    !path ||
    url.protocol !== 'https:' ||
    url.hostname !== TX_SERVICE_HOST ||
    url.username ||
    url.password ||
    url.port ||
    url.search ||
    url.hash
  )
    throw new Error(
      `Chain ${chainId} has an invalid transactionService ${JSON.stringify(value)}`
    )
  return `https://${TX_SERVICE_HOST}/tx-service/${path[1]}`
}

function sync(existing: TxServiceNetwork[], chains: ConfigChain[]): Sync {
  if (chains.length === 0)
    throw new Error('The Config Service returned no chains')
  const seen = new Set<number>()
  const parsed = chains.map(chain => {
    const chainId = parseChainId(chain.chainId)
    if (seen.has(chainId))
      throw new Error(
        `The Config Service returned chain ${chainId} twice (a paging problem)`
      )
    seen.add(chainId)
    return { chain, chainId }
  })
  const skipped = parsed
    .filter(({ chainId }) => EXCLUDED_CHAIN_IDS.has(chainId))
    .map(({ chain, chainId }) => ({ chainId, chainName: chain.chainName }))
  const validated = parsed
    .filter(({ chainId }) => !EXCLUDED_CHAIN_IDS.has(chainId))
    .map(({ chain, chainId }) => {
      if (!chain.transactionService)
        throw new Error(`No transactionService for chain ${chainId}`)
      const txServiceUrl = parseTxServiceUrl(chainId, chain.transactionService)
      return { chain, chainId, txServiceUrl }
    })

  const byChainId = new Map(existing.map(n => [n.chainId, n]))
  const takenNames = new Set(existing.map(n => n.networkName))
  const result: Sync = {
    networks: [],
    added: [],
    removed: [],
    changed: [],
    skipped
  }
  for (const { chain, chainId, txServiceUrl } of validated) {
    const current = byChainId.get(chainId)
    if (current) {
      const network = { ...current, txServiceUrl }
      result.networks.push(network)
      if (current.txServiceUrl !== txServiceUrl)
        result.changed.push({ network, previousUrl: current.txServiceUrl })
      continue
    }
    const networkName = slug(chain.chainName)
    if (!networkName || takenNames.has(networkName))
      throw new Error(
        `Chain ${chainId} (${chain.chainName}) derives networkName "${networkName}", ` +
          'which is empty or already taken'
      )
    takenNames.add(networkName)
    const network = {
      chainId,
      shortName: chain.shortName,
      networkName,
      txServiceUrl
    }
    result.networks.push(network)
    result.added.push({ network, chainName: chain.chainName })
  }

  const kept = new Set(result.networks.map(n => n.chainId))
  result.removed = existing.filter(n => !kept.has(n.chainId))
  const required = result.removed.find(n => n.shortName === REQUIRED_SHORT_NAME)
  if (required)
    throw new Error(
      `Refusing to remove ${required.networkName}: generate-api-reference depends on ` +
        `shortName "${REQUIRED_SHORT_NAME}"`
    )
  const unsafe = result.removed.find(n => !SAFE_NAME.test(n.networkName))
  if (unsafe)
    throw new Error(
      `Refusing to delete files for networkName "${unsafe.networkName}"`
    )

  result.networks.sort((a, b) => a.chainId - b.chainId)
  result.added.sort((a, b) => a.network.chainId - b.network.chainId)
  result.skipped.sort((a, b) => a.chainId - b.chainId)
  return result
}

// Pages by offset on the configured URL; the server's `next` URL is never requested.
async function fetchChains(): Promise<ConfigChain[]> {
  const base = `${CONFIG_SERVICE_URL.replace(/\/+$/, '')}/api/v1/chains/`
  const chains: ConfigChain[] = []
  for (let pages = 0; pages < MAX_PAGES; pages++) {
    const url = `${base}?limit=${PAGE_SIZE}&offset=${chains.length}`
    const response = await fetch(url, { redirect: 'error' })
    if (response.status !== 200)
      throw new Error(`GET ${url} answered ${response.status}`)
    const page = (await response.json()) as ChainPage
    chains.push(...page.results)
    if (page.next === null) return chains
    if (page.results.length === 0)
      throw new Error(`GET ${url} returned no chains but claims more`)
  }
  throw new Error(
    `The Config Service still had more chains after ${MAX_PAGES} pages`
  )
}

function summarize(
  { added, removed, changed, skipped }: Sync,
  dryRun: boolean
): string {
  const lines: string[] = []
  if (added.length > 0) {
    lines.push(`Added ${added.length} chain(s):`)
    for (const { network, chainName } of added)
      lines.push(`  ${network.chainId} ${chainName} -> ${network.networkName}`)
    lines.push(
      `  The networkName becomes the page URL; rename it in ${NETWORKS_FILE} ` +
        'before running generate-api-reference.'
    )
  }
  if (removed.length > 0) {
    lines.push(`Removed ${removed.length} chain(s):`)
    for (const network of removed) {
      lines.push(`  ${network.chainId} ${network.networkName}`)
      for (const file of generatedPaths(network.networkName).filter(
        fs.existsSync
      ))
        lines.push(`    ${dryRun ? 'would delete' : 'deleted'} ${file}`)
    }
  }
  if (changed.length > 0) {
    lines.push(`Changed txServiceUrl on ${changed.length} chain(s):`)
    for (const { network, previousUrl } of changed)
      lines.push(
        `  ${network.chainId} ${network.networkName}: ${previousUrl} -> ${network.txServiceUrl}`
      )
  }
  if (lines.length === 0) lines.push('Already up to date.')
  if (skipped.length > 0) {
    lines.push(`Skipped ${skipped.length} excluded chain(s):`)
    for (const { chainId, chainName } of skipped)
      lines.push(`  ${chainId} ${chainName}`)
  }
  if (dryRun) lines.push('Dry run: nothing written or deleted.')
  return lines.join('\n')
}

async function main(dryRun: boolean): Promise<void> {
  const source = fs.readFileSync(NETWORKS_FILE, 'utf8')
  const result = sync(
    JSON.parse(source) as TxServiceNetwork[],
    await fetchChains()
  )
  const summary = summarize(result, dryRun)
  if (!dryRun) {
    const output = JSON.stringify(result.networks, null, 2) + '\n'
    if (output !== source) fs.writeFileSync(NETWORKS_FILE, output)
    for (const network of result.removed)
      for (const file of generatedPaths(network.networkName))
        fs.rmSync(file, { recursive: true, force: true })
  }
  console.info(summary)
}

main(process.argv.includes('--dry-run')).catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
