import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 59144n
})

const info = await apiKit.getServiceInfo()

console.log(info)
