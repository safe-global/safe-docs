import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 11155111n,
  apiKey: 'YOU_API_KEY'
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
