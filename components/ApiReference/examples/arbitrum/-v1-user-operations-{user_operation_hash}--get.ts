import { Safe4337Pack } from '@safe-global/relay-kit'

const safe4337Pack = await Safe4337Pack.init({
  provider: 'https://eth-sepolia.public.blastapi.io',
  signer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x97566B1eCaCd321736F183117C26ACe1b72F4a1b'
  }
})

const userOperationHash =
  '0x7bf502ad622e62823c971d800033e82e5670fcdd1c19437555fb2d8b7eefd644'

const userOperation = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)

console.log(userOperation)
