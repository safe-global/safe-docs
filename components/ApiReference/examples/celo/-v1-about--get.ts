import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 42220n
})

const info = await apiKit.getServiceInfo()

console.log(info)
