import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 84532n
})

const safeTxHash = '0x897cab0528ffa8cbe10ee533e636d1a42b9e8d42f8dccb9af9006804d02d2027'

const transaction = await apiKit.getTransaction(safeTxHash)

console.log(transaction)
