import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 480n,
  txServiceApiKey: 'YOU_API_KEY'
})

const info = await apiKit.getServiceSingletonsInfo()

console.log(info)
