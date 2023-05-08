import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter, getSafeContract } from '@safe-global/protocol-kit'
import { MetaTransactionData, MetaTransactionOptions, OperationType, RelayTransaction } from '@safe-global/safe-core-sdk-types'

// Customize the following variables
// https://chainlist.org
const RPC_URL = 'https://endpoints.omniatech.io/v1/bsc/mainnet/public'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const safeAddress = '0x6651FD6Abe0843f7B6CB9047b89655cc7Aa78221' // Safe from which the transaction will be sent. Replace with your Safe address
const chainId = 56

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const withdrawAmount = ethers.utils.parseUnits('0.0005', 'ether').toString()

// Get Gelato Relay API Key: https://relay.gelato.network/
const GELATO_RELAY_API_KEY = process.env.GELATO_RELAY_API_KEY!

// Usually a limit of 21000 is used but for smart contract interactions, you can increase to 100000 because of the more complex interactions.
const gasLimit = '100000'

// Create a transaction object
const safeTransactionData: MetaTransactionData = {
  to: destinationAddress,
  data: '0x',// leave blank for ETH transfers
  value: withdrawAmount,
  operation: OperationType.Call
}
const options: MetaTransactionOptions = {
  gasLimit: gasLimit,
  isSponsored: true
}

// Create the Protocol and Relay Kit instance

async function relayTransaction() {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer
  })

  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress
  })

  const relayKit = new GelatoRelayPack(GELATO_RELAY_API_KEY)

  // Prepare the transaction
  const safeTransaction = await safeSDK.createTransaction({
    safeTransactionData
  })

  const signedSafeTx = await safeSDK.signTransaction(safeTransaction)
  const safeSingletonContract = await getSafeContract({ ethAdapter, safeVersion: await safeSDK.getContractVersion() })

  const encodedTx = safeSingletonContract.encode('execTransaction', [
    signedSafeTx.data.to,
    signedSafeTx.data.value,
    signedSafeTx.data.data,
    signedSafeTx.data.operation,
    signedSafeTx.data.safeTxGas,
    signedSafeTx.data.baseGas,
    signedSafeTx.data.gasPrice,
    signedSafeTx.data.gasToken,
    signedSafeTx.data.refundReceiver,
    signedSafeTx.encodedSignatures()
  ])

  const relayTransaction: RelayTransaction = {
    target: safeAddress,
    encodedTransaction: encodedTx,
    chainId: chainId,
    options
  }
  const response = await relayKit.relayTransaction(relayTransaction)

  console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
}

relayTransaction()
