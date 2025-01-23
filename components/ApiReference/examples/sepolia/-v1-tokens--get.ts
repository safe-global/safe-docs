import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 11155111n
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
