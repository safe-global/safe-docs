const fs: typeof import('fs') = require('fs')

const NETWORKS_FILE = 'components/ApiReference/tx-service-networks.json'
const CONFIG_SERVICE_URL =
  process.env.SAFE_CONFIG_SERVICE_URL ?? 'https://safe-config.safe.global'
// generateApiReference.ts builds the shared API reference from this network.
const REQUIRED_SHORT_NAME = 'sep'
const SAFE_NAME = /^[\w-]+$/

interface TxServiceNetwork {
  chainId: number
  shortName: string
  networkName: string
  txServiceUrl: string
}

interface ConfigChain {
  chainId: string
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

function sync(existing: TxServiceNetwork[], chains: ConfigChain[]): Sync {
  if (chains.length === 0)
    throw new Error('The Config Service returned no chains')
  const missing = chains.filter(chain => !chain.transactionService)
  if (missing.length > 0)
    throw new Error(
      `No transactionService for chain ${missing.map(c => c.chainId).join(', ')}`
    )

  const byChainId = new Map(existing.map(n => [n.chainId, n]))
  const takenNames = new Set(existing.map(n => n.networkName))
  const result: Sync = { networks: [], added: [], removed: [], changed: [] }
  for (const chain of chains) {
    const chainId = Number(chain.chainId)
    const txServiceUrl = (chain.transactionService ?? '').replace(/\/+$/, '')
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
  return result
}

async function fetchChains(): Promise<ConfigChain[]> {
  const chains: ConfigChain[] = []
  let url: string | null =
    `${CONFIG_SERVICE_URL.replace(/\/+$/, '')}/api/v1/chains/?limit=100`
  while (url) {
    const response = await fetch(url)
    if (response.status !== 200)
      throw new Error(`GET ${url} answered ${response.status}`)
    const page = (await response.json()) as ChainPage
    chains.push(...page.results)
    url = page.next
  }
  return chains
}

function summarize({ added, removed, changed }: Sync, dryRun: boolean): string {
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
