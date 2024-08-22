import { concat } from 'viem'
import { PrepareUserOperationRequestReturnType } from 'permissionless/actions/smartAccount'
import { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types'
import {
  getSocialRecoveryValidator,
  getSocialRecoveryGuardians,
  getAccount,
  SOCIAL_RECOVERY_ADDRESS
} from '@rhinestone/module-sdk'

import {
  bundlerClient,
  PermissionlessClient,
  publicClient
} from './permissionless'
export interface SocialRecoveryDataInput {
  guardians: `0x${string}`[]
  threshold: number
}

export type UserOpRequest = Omit<
  PrepareUserOperationRequestReturnType<ENTRYPOINT_ADDRESS_V07_TYPE>,
  'initCode' | 'paymasterAndData'
>

// Installs the Social Recovery module on the safe
export const install7579Module = async (
  safe: PermissionlessClient,
  socialRecoveryInput: SocialRecoveryDataInput
) => {
  const socialRecoveryValidator =
    getSocialRecoveryValidator(socialRecoveryInput)

  const txHash = await safe.installModule({
    type: 'validator',
    address: SOCIAL_RECOVERY_ADDRESS,
    context: socialRecoveryValidator.initData as `0x${string}`
  })

  console.log(
    'Social Recovery module is being installed: https://sepolia.etherscan.io/tx/' +
      txHash
  )

  const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: txHash,
    timeout: 120000
  })
  return receipt
}

// Gets the guardians of the safe
export const getGuardians = async (safe: PermissionlessClient) => {
  const account = getAccount({ address: safe.account.address, type: 'safe' })
  const guardians = (await getSocialRecoveryGuardians({
    account,
    client: publicClient
  })) as `0x${string}`[]
  return guardians
}

// Recovers the safe by adding the first guardian as a new owner of the safe
export const recoverSafe = async (
  safe: PermissionlessClient,
  userOp: UserOpRequest,
  ...signatures: `0x${string}`[]
) => {
  const txHash = await safe.sendUserOperation({
    userOperation: {
      ...userOp,
      signature: concat(signatures)
    }
  })
  console.info(
    'Safe is being recovered: https://jiffyscan.xyz/userOpHash/' + txHash
  )
  const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: txHash,
    timeout: 120000
  })
  return receipt
}
