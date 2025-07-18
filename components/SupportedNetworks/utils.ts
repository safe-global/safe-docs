import txServiceNetworks from '../ApiReference/tx-service-networks.json'

export const deprecatedNetworks = [
  3, // Ropsten
  4, // Rinkeby
  5, // Goerli
  28, // Boba Rinkeby
  42, // Kovan
  69, // Optimistic Kovan
  280, // zkSync Goerli
  420, // Optimistic Goerli
  599, // Metis Goerli
  59140, // Linea Goerli
  80001, // Polygon Mumbai
  84531, // Base goerli
  421611, // Arbitrum Rinkeby
  421613 // Arbitrum Goerli
]

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
