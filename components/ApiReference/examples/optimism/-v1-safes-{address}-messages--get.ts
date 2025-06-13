import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 10n,
  apiKey: 'YOU_API_KEY'
})

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const messages = await apiKit.getMessages(safeAddress)

console.log(messages)
