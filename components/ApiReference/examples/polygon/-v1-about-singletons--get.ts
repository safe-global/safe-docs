import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 137n
})

const info = await apiKit.getServiceSingletonsInfo()

console.log(info)
