import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 43114n,
  apiKey: 'YOU_API_KEY'
})

const moduleTransactions = await apiKit.getModuleTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(moduleTransactions)
