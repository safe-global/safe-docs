import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1313161554n
})

const info = await apiKit.getServiceSingletonsInfo()

console.log(info)
