import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 11155111n,
  apiKey: 'YOUR_API_KEY'
})

const transactions = await apiKit.getAllTransactions(
  '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
)

console.log(transactions)
