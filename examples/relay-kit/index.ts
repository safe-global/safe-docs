import { ethers } from "ethers"
import { GelatoRelayAdapter, MetaTransactionOptions } from '@safe-global/relay-kit'
import AccountAbstraction, {
    AccountAbstractionConfig,
    MetaTransactionData,
    OperationType
} from '@safe-global/account-abstraction-kit-poc'

// Customize the following variables
// https://chainlist.org
const RPC_URL='https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const withdrawAmount = ethers.utils.parseUnits('0.005', 'ether').toString()
const gasLimit = '100000'

// Create a transaction object
const safeTransaction: MetaTransactionData = {
    to: destinationAddress,
    data: '0x',// leave blank for ETH transfers
    value: ethers.BigNumber.from(withdrawAmount),
    operation: OperationType.Call
  }
const options: MetaTransactionOptions = {
    gasLimit: ethers.BigNumber.from(gasLimit),
    isSponsored: true
}

// Create your account abstraction instance

async function relayTransaction() {
    const safeAccountAbstraction = new AccountAbstraction(signer)
    const relayAdapter = new GelatoRelayAdapter(process.env.GELATO_RELAY_API_KEY!)
    const sdkConfig: AccountAbstractionConfig = {
        relayAdapter
    }
    await safeAccountAbstraction.init(sdkConfig)
    
    const response = await safeAccountAbstraction.relayTransaction(safeTransaction, options)
    console.log({ GelatoTaskId: response })
}

relayTransaction()