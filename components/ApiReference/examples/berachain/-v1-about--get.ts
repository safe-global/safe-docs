import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 80094n,
  apiKey: 'YOUR_API_KEY'
})

const info = await apiKit.getServiceInfo()

console.log(info)
