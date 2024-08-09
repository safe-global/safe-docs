import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 11155111n
})

const safeTransaction = {
  to,
  value,
  data,
  operation
}

const estimateTx = await apiKit.estimateSafeTransaction(
  safeAddress,
  safeTransaction
)

console.log(estimateTx)