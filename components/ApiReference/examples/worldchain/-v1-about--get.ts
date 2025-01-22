import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 480n
})

const info = await apiKit.getServiceInfo()

console.log(info)
