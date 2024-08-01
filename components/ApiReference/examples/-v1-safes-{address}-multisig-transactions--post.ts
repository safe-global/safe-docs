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
