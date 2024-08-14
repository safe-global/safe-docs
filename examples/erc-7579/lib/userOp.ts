import {
  parseAbiItem,
  encodeFunctionData,
  encodeAbiParameters,
  keccak256
} from 'viem'

import {
  bundlerClient,
  getPermissionlessAccount,
  PermissionlessClient
} from './permissionless'
import { sepolia } from 'viem/chains'
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import { PrepareUserOperationRequestReturnType } from 'permissionless/actions/smartAccount'
import { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types'

export interface SocialRecoveryDataInput {
  guardians: `0x${string}`[]
  threshold: number
}

export type UserOpRequest = Omit<
  PrepareUserOperationRequestReturnType<ENTRYPOINT_ADDRESS_V07_TYPE>,
  'initCode' | 'paymasterAndData'
>

export const getUserOp = async (
  permissionlessClient: PermissionlessClient,
  newOwner: `0x${string}`
) => {
  const permissionlessAccount = await getPermissionlessAccount()

  const callData = await permissionlessAccount.encodeCallData({
    to: permissionlessClient.account.address,
    data: encodeFunctionData({
      abi: [
        parseAbiItem(
          'function addOwnerWithThreshold(address owner, uint256 _threshold)'
        )
      ],
      functionName: 'addOwnerWithThreshold',
      args: [newOwner, 1n]
    }),
    value: 0n
  })

  // only if using pimlico
  const gasPrices = await bundlerClient.getUserOperationGasPrice()

  return await permissionlessClient.prepareUserOperationRequest({
    userOperation: {
      callData, // callData is the only required field in the partial user operation
      maxFeePerGas: gasPrices.fast.maxFeePerGas,
      maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas
    }
  })
}

export const getUserOpHash = (userOp: UserOpRequest) => {
  const packedData = encodeAbiParameters(
    [
      { name: 'sender', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'initCode', type: 'bytes32' },
      { name: 'callData', type: 'bytes32' },
      { name: 'callGasLimit', type: 'uint256' },
      { name: 'verificationGasLimit', type: 'uint256' },
      { name: 'preVerificationGas', type: 'uint256' },
      { name: 'maxFeePerGas', type: 'uint256' },
      { name: 'maxPriorityFeePerGas', type: 'uint256' },
      { name: 'paymasterData', type: 'bytes32' }
    ],
    [
      userOp.sender,
      userOp.nonce,
      keccak256('0x'),
      keccak256(userOp.callData),
      userOp.callGasLimit,
      userOp.verificationGasLimit,
      userOp.preVerificationGas,
      userOp.maxFeePerGas,
      userOp.maxPriorityFeePerGas,
      keccak256(userOp.paymasterData as `0x${string}`)
    ]
  )

  const encodedUserOpHash = encodeAbiParameters(
    [
      { name: 'packedData', type: 'bytes32' },
      { name: 'entryPoint', type: 'address' },
      { name: 'chainId', type: 'uint256' }
    ],
    [keccak256(packedData), ENTRYPOINT_ADDRESS_V07, BigInt(sepolia.id)]
  )

  return keccak256(encodedUserOpHash)
}
