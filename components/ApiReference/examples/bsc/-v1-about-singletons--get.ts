import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 56n
})

const info = await apiKit.getServiceSingletonsInfo()

console.log(info)
