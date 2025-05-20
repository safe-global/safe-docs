import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

const protocolKit = await Safe.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  safeAddress: '0x5298a93734c3d979ef1f23f78ebb871879a21f22'
})

const apiKit = new SafeApiKit({
  chainId: 42161n,
  txServiceApiKey: 'YOU_API_KEY'
})

const messageHash =
  '0xdd8c1417bf85842b6181288b1d2da439175c39dcef149097833dd25aef918d79'
const rawMessage = 'string message'
const safeMessage = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(safeMessage, 'eth_sign')

const result = await apiKit.addMessageSignature(
  messageHash,
  signedMessage.encodedSignatures()
)

console.log(result)
