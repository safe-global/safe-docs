import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 11155111n
})

const messages = await apiKit.getMessages(safeAddress)

console.log(messages)
