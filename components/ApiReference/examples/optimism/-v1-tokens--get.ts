import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10n
})

const tokenList = await apiKit.getTokenList()

console.log(tokenList)
