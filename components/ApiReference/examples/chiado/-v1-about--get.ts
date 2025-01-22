import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10200n
})

const info = await apiKit.getServiceInfo()

console.log(info)
