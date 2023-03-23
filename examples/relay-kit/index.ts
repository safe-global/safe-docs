import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import { GelatoRelayAdapter, MetaTransactionOptions, RelayTransaction } from '@safe-global/relay-kit'
import Safe from '@safe-global/safe-core-sdk'
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types'

// Customize the following variables
// https://chainlist.org
// https://chainlist.org
const RPC_URL='https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const safeAddress = '0x...' // Safe from which the transaction will be sent
const chainId = 5

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const withdrawAmount = ethers.utils.parseUnits('0.005', 'ether').toString()

// Usually a limit of 21000 is used but for smart contract interactions, you can increase to 100000 because of the more complex interactions.
const gasLimit = '100000'

// Create a transaction object
const safeTransaction: MetaTransactionData = {
    to: destinationAddress,
    data: '0x',// leave blank for ETH transfers
    value: withdrawAmount,
    operation: OperationType.Call
  }
const options: MetaTransactionOptions = {
    gasLimit: ethers.BigNumber.from(gasLimit),
    isSponsored: true
}

// Create the Protocol and Relay Adapter Instance

async function relayTransaction() {
    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer
      })
      
    const safeSDK = await Safe.create({
        ethAdapter,
        safeAddress
    })

    // Get Gelato Relay API Key: https://relay.gelato.network/
    const relayAdapter = new GelatoRelayAdapter(process.env.GELATO_RELAY_API_KEY!)

    //Prepare the transaction
    const standarizedSafeTx = await safeSDK.createTransaction({
        safeTransactionData: safeTransaction
      })
      
      const signedSafeTx = await safeSDK.signTransaction(standarizedSafeTx)
      
      const encodedTx = safeSDK.getContractManager().safeContract.encode('execTransaction', [
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
      const response = await relayAdapter.relayTransaction(relayTransaction)

      console.log(`Relay Transaction Task ID:${response.taskId}`)
}

relayTransaction()