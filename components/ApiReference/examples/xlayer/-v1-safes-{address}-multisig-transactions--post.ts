import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 196n
})

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const safeTransaction = {
  to: safeAddress,
  value: '0',
  data: '0x',
  operation: 0 // 0 = call, 1 = delegate call
}

const estimateTx = await apiKit.estimateSafeTransaction(
  safeAddress,
  safeTransaction
)

console.log(estimateTx)
