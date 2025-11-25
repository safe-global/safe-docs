import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x5298a93734c3d979ef1f23f78ebb871879a21f22'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress
})

const apiKit = new SafeApiKit({
  chainId: 999n,
  apiKey: 'YOUR_API_KEY'
})

const rawMessage = '1: string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

console.log({
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})

apiKit.addMessage(safeAddress, {
  message: rawMessage,
  signature: signedMessage.encodedSignatures()
})
