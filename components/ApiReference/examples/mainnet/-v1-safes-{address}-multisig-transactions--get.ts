import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1n,
  apiKey: 'YOU_API_KEY'
})

const multisigTransactions = await apiKit.getMultisigTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(multisigTransactions)
