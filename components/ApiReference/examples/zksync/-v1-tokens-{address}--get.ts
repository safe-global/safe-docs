import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 324n,
  apiKey: 'YOUR_API_KEY'
})

const token = await apiKit.getToken(
  '0x687e43D0aB3248bDfebFE3E8f9F1AB2B9FcE982d'
)

console.log(token)
