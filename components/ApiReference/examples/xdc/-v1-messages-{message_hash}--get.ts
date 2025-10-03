import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 50n,
  apiKey: 'YOUR_API_KEY'
})

const messageHash =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'

const message = await apiKit.getMessage(messageHash)

console.log(message)
