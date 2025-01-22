import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 11155111n
})

const safes = await apiKit.getSafesByOwner(
  '0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2'
)

console.log(safes)
