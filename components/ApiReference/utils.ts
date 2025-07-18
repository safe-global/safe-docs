// TODO: Remove this when the new txService swaggers are accessible without a token
export const getSwaggerUrl = (network: string): string => {
  switch (network) {
    case 'https://api.safe.global/tx-service/eth':
      return 'https://safe-transaction-mainnet.safe.global'
    case 'https://api.safe.global/tx-service/oeth':
      return 'https://safe-transaction-optimism.safe.global'
    case 'https://api.safe.global/tx-service/bnb':
      return 'https://safe-transaction-bsc.safe.global'
    case 'https://api.safe.global/tx-service/gno':
      return 'https://safe-transaction-gnosis-chain.safe.global'
    case 'https://api.safe.global/tx-service/unichain':
      return 'https://safe-transaction-unichain.safe.global'
    case 'https://api.safe.global/tx-service/pol':
      return 'https://safe-transaction-polygon.safe.global'
    case 'https://api.safe.global/tx-service/sonic':
      return 'https://safe-transaction-sonic.safe.global'
    case 'https://api.safe.global/tx-service/okb':
      return 'https://safe-transaction-xlayer.safe.global'
    case 'https://api.safe.global/tx-service/lens':
      return 'https://safe-transaction-lens.safe.global'
    case 'https://api.safe.global/tx-service/zksync':
      return 'https://safe-transaction-zksync.safe.global'
    case 'https://api.safe.global/tx-service/wc':
      return 'https://safe-transaction-worldchain.safe.global'
    case 'https://api.safe.global/tx-service/zkevm':
      return 'https://safe-transaction-zkevm.safe.global'
    case 'https://api.safe.global/tx-service/mantle':
      return 'https://safe-transaction-mantle.safe.global'
    case 'https://api.safe.global/tx-service/base':
      return 'https://safe-transaction-base.safe.global'
    case 'https://api.safe.global/tx-service/chi':
      return 'https://safe-transaction-chiado.safe.global'
    case 'https://api.safe.global/tx-service/arb1':
      return 'https://safe-transaction-arbitrum.safe.global'
    case 'https://api.safe.global/tx-service/celo':
      return 'https://safe-transaction-celo.safe.global'
    case 'https://api.safe.global/tx-service/hemi':
      return 'https://safe-transaction-hemi.safe.global'
    case 'https://api.safe.global/tx-service/avax':
      return 'https://safe-transaction-avalanche.safe.global'
    case 'https://api.safe.global/tx-service/ink':
      return 'https://safe-transaction-ink.safe.global'
    case 'https://api.safe.global/tx-service/linea':
      return 'https://safe-transaction-linea.safe.global'
    case 'https://api.safe.global/tx-service/berachain':
      return 'https://safe-transaction-berachain.safe.global'
    case 'https://api.safe.global/tx-service/basesep':
      return 'https://safe-transaction-base-sepolia.safe.global'
    case 'https://api.safe.global/tx-service/scr':
      return 'https://safe-transaction-scroll.safe.global'
    case 'https://api.safe.global/tx-service/sep':
      return 'https://safe-transaction-sepolia.safe.global'
    case 'https://api.safe.global/tx-service/aurora':
      return 'https://safe-transaction-aurora.safe.global'
    case 'https://api.safe.global/tx-service/katana':
      return 'https://safe-transaction-katana.safe.global'
    case 'https://api.safe.global/tx-service/codex':
      return 'https://safe-transaction-codex.safe.global'
    case 'https://api.safe.global/tx-service/peaq':
      return 'https://safe-transaction-peaq.safe.global'
    default:
      return network
  }
}
