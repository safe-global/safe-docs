import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 81457n
})

const info = await apiKit.getServiceInfo()

console.log(info)
