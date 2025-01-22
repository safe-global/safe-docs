import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 5000n
})

const info = await apiKit.getServiceInfo()

console.log(info)
