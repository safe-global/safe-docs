import {
  createPublicClient,
  http,
  Chain,
  Transport,
  WalletClient,
  Account
} from 'viem'
import { sepolia } from 'viem/chains'
import {
  ENTRYPOINT_ADDRESS_V07,
  createSmartAccountClient,
  SmartAccountClient,
  walletClientToSmartAccountSigner
} from 'permissionless'
import {
  SafeSmartAccount,
  signerToSafeSmartAccount
} from 'permissionless/accounts'
import { erc7579Actions, Erc7579Actions } from 'permissionless/actions/erc7579'
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient
} from 'permissionless/clients/pimlico'
import { EntryPoint } from 'permissionless/types'

export type PermissionlessClient = SmartAccountClient<
  EntryPoint,
  Transport,
  Chain,
  SafeSmartAccount<EntryPoint>
> &
  Erc7579Actions<EntryPoint, SafeSmartAccount<EntryPoint>>

export type WalletClientWithTransport = WalletClient<Transport, Chain, Account>

const pimlicoUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
const safe4337ModuleAddress = '0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2'
const erc7569LaunchpadAddress = '0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE'
export const rpcUrl = 'https://rpc.ankr.com/eth_sepolia'

export const publicClient = createPublicClient({
  transport: http(rpcUrl)
})

const paymasterClient = createPimlicoPaymasterClient({
  transport: http(pimlicoUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V07
})

export const bundlerClient = createPimlicoBundlerClient({
  transport: http(pimlicoUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V07
})

// Initializes a permissionless client from a viem wallet client
export const getPermissionlessClient = async (
  walletClient: WalletClientWithTransport
) => {
  const signer = walletClientToSmartAccountSigner(walletClient)
  const permissionlessAccount = await signerToSafeSmartAccount(publicClient, {
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    signer,
    safeVersion: '1.4.1',
    saltNonce: 120n,
    safe4337ModuleAddress,
    erc7569LaunchpadAddress
  })

  const permissionlessClient = createSmartAccountClient({
    chain: sepolia,
    account: permissionlessAccount,
    bundlerTransport: http(pimlicoUrl),
    middleware: {
      gasPrice: async () =>
        (await bundlerClient.getUserOperationGasPrice()).fast,
      sponsorUserOperation: paymasterClient.sponsorUserOperation
    }
  }).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }))

  return permissionlessClient as PermissionlessClient
}
