import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 137n
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
