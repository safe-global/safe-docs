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

export const txServiceNetworks = [
  1, // Ethereum
  10, // Optimism
  56, // BNB Smart Chain
  100, // Gnosis Chain
  137, // Polygon
  196, // X Layer
  324, // zkSync Era
  1101, // Polygon zkEVM
  8453, // Base
  42161, // Arbitrum
  42220, // Celo
  43114, // Avalanche
  59144, // Linea
  84532, // Base Sepolia
  534352, // Scroll
  11155111, // Sepolia
  1313161554 // Aurora
]

export const apiServices = [
  'Transaction Service',
  'Event Service',
  'Safe{Core} SDK',
  'Safe{Wallet}'
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

export const shortNametoTxService = (shortName: string): string => {
  switch (shortName) {
    case 'eth':
      return 'mainnet'
    case 'oeth':
      return 'optimism'
    default:
      return shortName
  }
}

// export const shortNameToIcon = (shortName: string): string => {
//   if (shortNameToIconName(shortName) == null) return '/unknown-logo.png'
//   if (shortNameToIconName(shortName)?.endsWith('.jpg') === true) {
//     return `https://icons.llamao.fi/icons/chains/rsz_${shortNameToIconName(
//       shortName
//     )}`
//   }
//   return `https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/refs/heads/master/128/${shortNameToIconName(
//     shortName
//   )}.png`
// }
