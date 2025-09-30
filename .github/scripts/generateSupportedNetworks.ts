// This script generates the supported networks page from the safe-deployments repo.
// It clones the repo, reads the JSON files, and generates the markdown files as well as a _meta.json file for nextra.

const shell = require('shelljs')
const fs = require('fs')
const path = require('path')

interface Network {
  name: string
  chainId: number
  addressName: string | Array<string>
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

  const allNetworks = await fetch
    .default('https://chainid.network/chains.json')
    .then(res => res.json() as Promise<Network[]>)

  const smartAccounts = await getDeployedContractsFromGithubRepo(allNetworks)
  const modules = await getDeployedContractsFromGithubRepo(allNetworks, true)

  const networks = await Promise.all(
    allNetworks
      .filter(n =>
        smartAccounts.map(c => c.chainId).includes(n.chainId.toString())
      )
      .map(async n => {
        // Use our logos if running the service, else test if the icon exists in the llamao icons, if not, use the cryptocurrency-icons repo
        const safeAssets = `https://safe-transaction-assets.safe.global/chains/${n.chainId}/chain_logo.png`
        const llamaoIcon = `https://icons.llamao.fi/icons/chains/rsz_${n.icon}.jpg`
        const shortNameIcon = `https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/refs/heads/master/128/${shortNameToIconName(
          n.shortName
        )}.png`

        const fetchIcon = async (url: string) => {
          try {
            const res = await fetch.default(url)
            if (res.ok) return url
          } catch (e) {
            // Ignore errors and fall back to the next option
          }
          return null;
        }

        const iconUrl =
          n.icon == null
            ? (await fetchIcon(safeAssets)) || (await fetchIcon(shortNameIcon))
            : (await fetchIcon(safeAssets)) || (await fetchIcon(llamaoIcon)) || (await fetchIcon(shortNameIcon))
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

  console.log(`Writing file ${targetFilePath}...`)
  fs.writeFileSync(targetFilePath, JSON.stringify(networks, null, 2))
  console.log(`Process completed.`)
}

generateSupportedNetworks()
