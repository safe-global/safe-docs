import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 59144n,
  apiKey: 'YOUR_API_KEY'
})

const info = await apiKit.getServiceSingletonsInfo()

console.log(info)
