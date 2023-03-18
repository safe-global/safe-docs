import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import SafeServiceClient, { SafeCreationInfoResponse } from '@safe-global/safe-service-client'

const safeAddress = '0xb67bF8d736b7024eaE034Fc0fBe80625823a6b76'

const proxyFactoryAddress = '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2'

// put information about the original and recovery chain here
const CHAINS = {
    '5': {
        name: 'Goerli',
        rpc: 'https://rpc.ankr.com/eth_goerli',
        txServiceUrl: 'https://safe-transaction-goerli.safe.global',
    },
    '137': {
        name: 'Polygon',
        // https://chainlist.org/
        rpc: 'https://polygon.llamarpc.com',
        // https://docs.safe.global/learn/safe-core/safe-core-api/available-services
        txServiceUrl: 'https://safe-transaction-polygon.safe.global/',
    },
}

const ORIGINAL_CHAIN_ID = '5'
const RECOVERY_CHAIN_ID = '137'

async function recreateSafe(originalChain:any, recoveryChain: any) {
    const originalChainProvider = new ethers.providers.JsonRpcProvider(originalChain.rpc)

    const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: originalChainProvider // we don't need a signer here yet since we're in read-only mode
    })

    const safeService = new SafeServiceClient({ txServiceUrl: originalChain.txServiceUrl,
        ethAdapter: ethAdapter })

    // Get information about the safe creation transaction
    const safeCreationInfo: SafeCreationInfoResponse = await safeService.getSafeCreationInfo(safeAddress)

    console.log({safeCreationInfo})

    const { transactionHash } = safeCreationInfo

    const safeCreationTx = await originalChainProvider.getTransaction(transactionHash)

    console.log({safeCreationTx})

    // Connect to the recovery chain

    const recoveryChainProvider = new ethers.providers.JsonRpcProvider(recoveryChain.rpc)

    const gasPrice = await recoveryChainProvider.getGasPrice();

    // Replay the transaction that created the safe on the original chain on the recovery chain
    const reCreateSafeTx = {
        to: proxyFactoryAddress,
        data: safeCreationTx.data,
        gasPrice,
        value: 0,
    }

    const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, recoveryChainProvider)

    const result = await owner1Signer.sendTransaction(reCreateSafeTx)

    console.log({result})

}

recreateSafe(CHAINS[ORIGINAL_CHAIN_ID], CHAINS[RECOVERY_CHAIN_ID])