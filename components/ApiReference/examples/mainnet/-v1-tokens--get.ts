import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1n,
  apiKey: 'YOU_API_KEY'
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
