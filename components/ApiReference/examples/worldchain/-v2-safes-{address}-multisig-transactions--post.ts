import SafeApiKit, { ProposeTransactionProps } from '@safe-global/api-kit'
import { SafeTransactionData } from '@safe-global/types-kit'

const apiKit = new SafeApiKit({
  chainId: 480n
})

const safeTransactionData: SafeTransactionData = {
  to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  value: '50000000000000',
  data: '0x',
  operation: 0, // 0 = call, 1 = delegate call
  safeTxGas: '0',
  baseGas: '0',
  gasPrice: '0',
  gasToken: '0x0000000000000000000000000000000000000000',
  refundReceiver: '0x0000000000000000000000000000000000000000',
  nonce: '10'
}

const proposeTransactionProps: ProposeTransactionProps = {
  safeAddress: '0x5298a93734c3d979ef1f23f78ebb871879a21f22',
  safeTxHash: '0x897cab0528ffa8cbe10ee533e636d1a42b9e8d42f8dccb9af9006804d02d2027',
  safeTransactionData,
  senderAddress: '0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2',
  senderSignature: '0xec2c1cf656d997f92247ddf59f30ce718de990ec4f8d4670a37d3d3594862f0d49ad2c553daa2ff937c50d45e9ca6a815f826d29603f8c5c818cb698ddc2383a20'
}

await apiKit.proposeTransaction(proposeTransactionProps)
