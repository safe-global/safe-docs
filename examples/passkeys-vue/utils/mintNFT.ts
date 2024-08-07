import type { PasskeyArgType } from '@safe-global/protocol-kit'
import { Safe4337Pack } from '@safe-global/relay-kit'
import { encodeFunctionData } from 'viem'

/**
 * Mint an NFT.
 * @param {PasskeyArgType} signer - Signer object with rawId and coordinates.
 * @param {string} safeAddress - Safe address.
 * @returns {Promise<void>}
 * @throws {Error} If the operation fails.
 */
export const mintNFT = async (passkey: PasskeyArgType, safeAddress: string) => {
  const runtimeConfig = useRuntimeConfig()

  const paymasterOptions = {
    isSponsored: true,
    paymasterAddress: PAYMASTER_ADDRESS,
    paymasterUrl: PAYMASTER_URL + runtimeConfig.public.NUXT_PUBLIC_PIMLICO_API_KEY
  }

  const safe4337Pack = await Safe4337Pack.init({
    provider: RPC_URL,
    signer: passkey,
    bundlerUrl: BUNDLER_URL + runtimeConfig.public.NUXT_PUBLIC_PIMLICO_API_KEY,
    paymasterOptions,
    options: {
      owners: [
        /* Other owners... */
      ],
      threshold: 1
    }
  })

  const mintNFTTransaction = {
    to: NFT_ADDRESS,
    data: encodeSafeMintData(safeAddress),
    value: '0'
  }

  const safeOperation = await safe4337Pack.createTransaction({
    transactions: [mintNFTTransaction]
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

/**
 * Encodes the data for a safe mint operation.
 * @param to The address to mint the token to.
 * @param tokenId The ID of the token to mint.
 * @returns The encoded data for the safe mint operation.
 */
export function encodeSafeMintData(
  to: string,
  tokenId: bigint = getRandomUint256()
): string {
  return encodeFunctionData({
    abi: [
      {
        constant: false,
        inputs: [
          {
            name: 'to',
            type: 'address'
          },
          {
            name: 'tokenId',
            type: 'uint256'
          }
        ],
        name: 'safeMint',
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ],
    functionName: 'safeMint',
    args: [to, tokenId]
  })
}

/**
 * Generates a random 256-bit unsigned integer.
 *
 * @returns {bigint} A random 256-bit unsigned integer.
 *
 * This function uses the Web Crypto API's `crypto.getRandomValues()` method to generate
 * a uniformly distributed random value within the range of 256-bit unsigned integers
 * (from 0 to 2^256 - 1).
 */
function getRandomUint256(): bigint {
  const dest = new Uint8Array(32) // Create a typed array capable of storing 32 bytes or 256 bits

  crypto.getRandomValues(dest) // Fill the typed array with cryptographically secure random values

  let result = 0n
  for (let i = 0; i < dest.length; i++) {
    result |= BigInt(dest[i]) << BigInt(8 * i) // Combine individual bytes into one bigint
  }

  return result
}
