import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 56n,
  apiKey: 'YOUR_API_KEY'
})

const safes = await apiKit.getSafesByModule(
  '0xB4F5e59987549a2586976e8957962dBD54a26FD0'
)

console.log(safes)
