import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1313161554n,
  apiKey: 'YOU_API_KEY'
})

const info = await apiKit.getServiceInfo()

console.log(info)
