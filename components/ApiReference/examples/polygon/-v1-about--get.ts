import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 137n,
  txServiceApiKey: 'YOU_API_KEY'
})

const info = await apiKit.getServiceInfo()

console.log(info)
