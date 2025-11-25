// This script generates the supported networks page from the safe-deployments repo.
// It clones the repo, reads the JSON files, and generates the markdown files as well as a _meta.json file for nextra.

const shell = require('shelljs')
const fs = require('fs')
const path = require('path')

interface Network {
  name: string
  chainId: number
  shortName: string
  icon?: string
  explorers: Array<{ url: string }>
}

// Explore a given directory recursively and return all the file paths
const walkPath = (dir: string) => {
  let results: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach(function (file: string) {
    const filePath: string = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat?.isDirectory()) {
      results = results.concat(walkPath(filePath))
    } else {
      results.push(filePath)
    }
  })

  return results
}

// Reduce function to deduplicate an array
const deduplicate = (acc: any, curr: any) => {
  if (acc.includes(curr)) {
    return acc
  }

  return [...acc, curr]
}

const shortNameToIconName = (shortName: string): string | null => {
  switch (shortName) {
    case 'eth':
      return 'ethereum'
    case 'oeth':
      return 'optimism-ethereum'
    case 'kal':
      return 'meta'
    case 'bsc':
    case 'bnbt':
      return 'binance-smart-chain'
    case 'gno':
      return 'gnosis-gno'
    case 'zks':
      return 'zk-sync'
    case 'pol':
      return 'polygon'
    case 'flr':
      return 'flare'
    case 'cflr':
    case 'sgb':
      return 'songbird'
    case 'cro':
      return 'cronos'
    case 'rsk':
    case 'trsk':
      return 'rsk-smart-bitcoin'
    case 'TST':
      return 'thundercore'
    case 'TelosEVM':
    case 'TelosEVMTestnet':
      return 'telos'
    case 'Bobabeam':
    case 'Boba':
    case 'BobaBnbTestnet':
    case 'BobaBnb':
    case 'bobaavax':
      return 'boba-network'
    case 'darwinia':
      return 'darwinia-network'
    default:
      return shortName
  }
}

const targetFilePath = './components/SupportedNetworks/networks.json'
const txServiceNetworksPath = './components/ApiReference/tx-service-networks.json'

// Helper function to sleep/delay execution
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to fetch with timeout
const fetchWithTimeout = async (url: string, timeoutMs: number = 10000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const fetch = await import('node-fetch')
    const response = await fetch.default(url, { signal: controller.signal as any })
    clearTimeout(timeoutId)
    return response
  } catch (e) {
    clearTimeout(timeoutId)
    throw e
  }
}

// Helper function to retry with exponential backoff
const fetchWithRetry = async (
  url: string,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<any> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url)
      if (response.ok) {
        return response
      }

      // If it's a rate limit error or server error, retry
      if (response.status === 429 || response.status >= 500) {
        if (attempt < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, attempt)
          console.log(`  Rate limit or server error (${response.status}), retrying in ${delay}ms...`)
          await sleep(delay)
          continue
        }
      }

      // For other errors (404, etc), don't retry
      return null
    } catch (e) {
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt)
        console.log(`  Fetch error, retrying in ${delay}ms...`)
        await sleep(delay)
      } else {
        return null
      }
    }
  }
  return null
}

const addressNameLabels = {
  canonical: 'Canonical contracts',
  eip155: 'EIP-155 contracts',
  zkSync: 'zkSync contracts'
}

const getDeployedContractsFromGithubRepo = async (
  allNetworks: Network[],
  module: boolean | undefined = false
) => {
  const deploymentRepoUrl = `https://github.com/safe-global/safe-${
    module ? 'modules-' : ''
  }deployments/`
  const repoDestination = module ? 'modules' : 'deployments'

  try {
    shell.exec(`git clone ${deploymentRepoUrl} ${repoDestination}`)

    let paths = walkPath(repoDestination + '/src/assets').map(p =>
      p.replace(repoDestination + '/src/assets/', '')
    )

    const contracts = paths
      .map(p => {
        const file = fs.readFileSync(repoDestination + `/src/assets/${p}`, 'utf8')
        const json = JSON.parse(file)

        return Object.entries(json.networkAddresses).map(
          ([chainId, addressName]) => {
            const blockExplorerUrl =
              allNetworks.find(n => n.chainId === parseInt(chainId))
                ?.explorers?.[0]?.url ?? ''
            return {
              name: p.split('/')[module ? 2 : 1].split('.')[0],
              version: p.split('/')[module ? 1 : 0],
              address:
                typeof addressName === 'string'
                  ? (json.deployments?.[addressName]?.address ??
                    json.networkAddresses[chainId])
                  : undefined,
              addresses:
                typeof addressName === 'string'
                  ? undefined
                  : (addressName as Array<string>).map(a => [
                      addressNameLabels[a as 'canonical'],
                      json.deployments[a]?.address
                    ]),
              chainId,
              chainName: allNetworks.find(n => n.chainId === parseInt(chainId))
                ?.name,
              blockExplorerUrl,
              ...(module ? { moduleName: p.split('/')[0] } : {})
            }
          }
        )
      })
      .flat()

    shell.rm('-rf', repoDestination)
    return contracts
  } finally {
    shell.rm('-rf', repoDestination)
  }
}

const generateSupportedNetworks = async () => {
  shell.rm('-rf', targetFilePath)

  const fetch = await import('node-fetch')

  // Load tx-service networks to identify chains with safeAssets icons
  console.log('Loading tx-service networks...')
  const txServiceNetworks = JSON.parse(fs.readFileSync(txServiceNetworksPath, 'utf8'))
  const txServiceChainIds = new Set(txServiceNetworks.map((n: any) => n.chainId))
  console.log(`Found ${txServiceChainIds.size} chains with safeAssets icons`)

  // Source from https://github.com/ethereum-lists/chains
  // hosted at https://chainid.network/chains.json
  // Alternative source from https://github.com/DefiLlama/chainlist
  // hosted at https://chainlist.org/rpcs.json
  const allNetworks = await fetch
    .default('https://chainlist.org/rpcs.json')
    .then(res => res.json() as Promise<Network[]>)

  const smartAccounts = await getDeployedContractsFromGithubRepo(allNetworks)
  const modules = await getDeployedContractsFromGithubRepo(allNetworks, true)

  // Filter networks to only those with deployed contracts
  const filteredNetworks = allNetworks.filter(n =>
    smartAccounts.map(c => c.chainId).includes(n.chainId.toString())
  )

  console.log(`Processing ${filteredNetworks.length} networks with deployed contracts`)

  // Split networks into two groups
  const txServiceNetworksList = filteredNetworks.filter(n => txServiceChainIds.has(n.chainId))
  const otherNetworksList = filteredNetworks.filter(n => !txServiceChainIds.has(n.chainId))

  console.log(`\n--- Processing ${txServiceNetworksList.length} tx-service networks (with rate limiting) ---`)

  // Process tx-service networks sequentially with rate limiting for safeAssets
  const txServiceNetworksWithIcons = []
  for (let i = 0; i < txServiceNetworksList.length; i++) {
    const n = txServiceNetworksList[i]
    console.log(`[${i + 1}/${txServiceNetworksList.length}] Processing ${n.name} (chainId: ${n.chainId})`)

    const safeAssets = `https://safe-transaction-assets.safe.global/chains/${n.chainId}/chain_logo.png`
    const llamaoIcon = `https://icons.llamao.fi/icons/chains/rsz_${n.icon}.jpg`
    const shortNameIcon = `https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/refs/heads/master/128/${shortNameToIconName(
      n.shortName
    )}.png`

    // Try safeAssets first with retry logic
    console.log(`  Trying safeAssets...`)
    const safeAssetsResponse = await fetchWithRetry(safeAssets)
    let iconUrl = safeAssetsResponse ? safeAssets : null

    // If safeAssets failed, try fallback icons
    if (!iconUrl) {
      console.log(`  safeAssets failed, trying fallbacks...`)
      if (n.icon != null) {
        const llamaoResponse = await fetchWithRetry(llamaoIcon, 2, 500)
        iconUrl = llamaoResponse ? llamaoIcon : null
      }

      if (!iconUrl) {
        const shortNameResponse = await fetchWithRetry(shortNameIcon, 2, 500)
        iconUrl = shortNameResponse ? shortNameIcon : null
      }
    }

    txServiceNetworksWithIcons.push({
      ...n,
      smartAccounts: smartAccounts.filter(
        c => c.chainId === n.chainId.toString()
      ),
      modules: modules.filter(c => c.chainId === n.chainId.toString()),
      iconUrl: iconUrl ?? '/unknown-logo.png'
    })

    console.log(`  ✓ Icon: ${iconUrl ? 'found' : 'using fallback'}`)

    // Add delay between requests to respect rate limit (4 RPS = 250ms)
    if (i < txServiceNetworksList.length - 1) {
      await sleep(250)
    }
  }

  console.log(`\n--- Processing ${otherNetworksList.length} other networks (parallel, no safeAssets) ---`)

  // Process other networks in batches (skip safeAssets, only try llamaoIcon and shortNameIcon)
  const batchSize = 25
  const otherNetworksWithIcons = []

  for (let i = 0; i < otherNetworksList.length; i += batchSize) {
    const batch = otherNetworksList.slice(i, i + batchSize)
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(otherNetworksList.length / batchSize)} (${batch.length} networks)`)

    const batchResults = await Promise.all(
      batch.map(async n => {
        const llamaoIcon = `https://icons.llamao.fi/icons/chains/rsz_${n.icon}.jpg`
        const shortNameIcon = `https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/refs/heads/master/128/${shortNameToIconName(
          n.shortName
        )}.png`

        let iconUrl = null

        // Try llamaoIcon if icon property exists
        if (n.icon != null) {
          const llamaoResponse = await fetchWithRetry(llamaoIcon, 2, 500)
          iconUrl = llamaoResponse ? llamaoIcon : null
        }

        // If llamaoIcon failed, try shortNameIcon
        if (!iconUrl) {
          const shortNameResponse = await fetchWithRetry(shortNameIcon, 2, 500)
          iconUrl = shortNameResponse ? shortNameIcon : null
        }

        return {
          ...n,
          smartAccounts: smartAccounts.filter(
            c => c.chainId === n.chainId.toString()
          ),
          modules: modules.filter(c => c.chainId === n.chainId.toString()),
          iconUrl: iconUrl ?? '/unknown-logo.png'
        }
      })
    )
    
    otherNetworksWithIcons.push(...batchResults)
    
    // Small delay between batches to be respectful to external services
    if (i + batchSize < otherNetworksList.length) {
      await sleep(100)
    }
  }

  // Combine both groups
  const networks = [...txServiceNetworksWithIcons, ...otherNetworksWithIcons]

  // Sort by chainId for consistency
  networks.sort((a, b) => a.chainId - b.chainId)

  console.log(`\nWriting file ${targetFilePath}...`)
  fs.writeFileSync(targetFilePath, JSON.stringify(networks, null, 2))
  
  const successfulIcons = networks.filter(n => n.iconUrl !== '/unknown-logo.png').length
  console.log(`\n✓ Process completed!`)
  console.log(`  Total networks: ${networks.length}`)
  console.log(`  Icons found: ${successfulIcons}/${networks.length}`)
  console.log(`  Icons missing: ${networks.length - successfulIcons}`)
}

generateSupportedNetworks()
