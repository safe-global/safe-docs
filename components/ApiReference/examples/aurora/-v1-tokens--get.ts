import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1313161554n
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
