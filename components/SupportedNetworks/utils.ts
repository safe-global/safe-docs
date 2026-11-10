import txServiceNetworks from '../ApiReference/tx-service-networks.json'
import deprecated from './deprecated-networks.json'

export const deprecatedNetworks = deprecated.map(network => network.chainId)

export const apiServices = (
  chainId: string
): Array<{ name: string; link: string }> => [
  {
    name: 'Safe{Core} SDK',
    link: '/sdk/overview'
  },
  {
    name: 'Safe{Wallet}',
    link: 'https://safe.global/wallet'
  },
  {
    name: 'Transaction Service',
    link: `/core-api/transaction-service-reference/${
      txServiceNetworks.find(n => n.chainId.toString() === chainId)?.networkName
    }`
  },
  {
    name: 'Event Service',
    link: 'https://github.com/safe-global/safe-events-service'
  }
]

export const curatedBlockExplorers = [
  'https://etherscan.io',
  'https://goerli.etherscan.io',
  'https://optimistic.etherscan.io',
  'https://bscscan.com',
  'https://testnet.bscscan.com',
  'https://gnosisscan.io',
  'https://polygonscan.com',
  'https://mumbai.polygonscan.com',
  'https://zkevm.polygonscan.com',
  'https://explorer.zksync.io',
  'https://basescan.org',
  'https://sepolia.basescan.org'
]
