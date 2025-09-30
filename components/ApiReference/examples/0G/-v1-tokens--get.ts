import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 16661n,
  apiKey: 'YOUR_API_KEY'
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
