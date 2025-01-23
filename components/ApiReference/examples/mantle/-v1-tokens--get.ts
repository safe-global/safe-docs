import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 5000n
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
