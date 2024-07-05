import { encodeFunctionData, parseAbi } from 'viem'
import { Safe4337Pack } from '@safe-global/relay-kit'

import { type PasskeyArgType } from './passkeys'
import {
  BUNDLER_URL,
  CHAIN_NAME,
  PAYMASTER_URL,
  RPC_URL,
  paymasterAddress,
  usdcTokenAddress
} from './constants'

const paymasterOptions = {
  isSponsored: true,
  paymasterAddress,
  paymasterUrl: PAYMASTER_URL
}

/**
 * Generate call data for USDC transfer.
 * @param {string} to - Recipient address.
 * @param {bigint} value - Amount to transfer.
 * @returns {string} Call data.
 */
const generateTransferCallData = (to: string, value: bigint) => {
  const abi = parseAbi([
    'function transfer(address _to, uint256 _value) returns (bool)'
  ])
  return encodeFunctionData({
    abi,
    functionName: 'transfer',
    args: [to as `0x${string}`, value]
  })
}

/**
 * Execute USDC transfer.
 * @param {PasskeyArgType} signer - Signer object with rawId and publicKey.
 * @param {string} safeAddress - Safe address.
 * @returns {Promise<void>}
 * @throws {Error} If the operation fails.
 */
export const executeUSDCTransfer = async ({
  signer,
  safeAddress
}: {
  signer: PasskeyArgType
  safeAddress: string
}) => {
  const safe4337Pack = await Safe4337Pack.init({
    provider: RPC_URL,
    rpcUrl: RPC_URL,
    signer,
    bundlerUrl: BUNDLER_URL,
    paymasterOptions,
    options: {
      owners: [
        /* Other owners... */
      ],
      threshold: 1
    }
  })

  const usdcAmount = 100_000n // 0.1 USDC

  const transferUSDC = {
    to: usdcTokenAddress,
    data: generateTransferCallData(safeAddress, usdcAmount),
    value: '0'
  }

  const safeOperation = await safe4337Pack.createTransaction({
    transactions: [transferUSDC]
  })

  const signedSafeOperation = await safe4337Pack.signSafeOperation(
    safeOperation
  )

  console.log('SafeOperation', signedSafeOperation)

  // 4) Execute SafeOperation
  const userOperationHash = await safe4337Pack.executeTransaction({
    executable: signedSafeOperation
  })

  return userOperationHash
}
