import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 677n,
  apiKey: 'YOUR_API_KEY'
})

const info = await apiKit.getServiceSingletonsInfo()

console.log(info)
