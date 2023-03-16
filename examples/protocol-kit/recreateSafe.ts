import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import SafeServiceClient, { SafeCreationInfoResponse } from '@safe-global/safe-service-client'


const safeAddress = '0xF188d41FD181f94960C5451D7ff6FdbcDf201a71'

const proxyFactoryAddress = '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2'

// put information about the original and recovery chain here
const CHAINS = {
    '5': {
        name: 'Goerli',
        rpc: 'https://rpc.ankr.com/eth_goerli',
        txServiceUrl: 'https://safe-transaction-goerli.safe.global',
    },
    '56': {
        name: 'BSC',
        rpc: 'https://bsc-dataseed.binance.org',
        txServiceUrl: 'https://safe-transaction-bsc.safe.global/',
    },
}

const ORIGINAL_CHAIN_ID = '5'
const RECOVERY_CHAIN_ID = '56'

async function recreateSafe(originalChain: any, recoveryChain: any) {
    const originalChainProvider = new ethers.providers.JsonRpcProvider(originalChain.rpc)

    const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: originalChainProvider // we don't need a signer here yet since we're in read-only mode
    })

    const safeService = new SafeServiceClient({ txServiceUrl: originalChain.txServiceUrl,
        ethAdapter: ethAdapter })

    const safeCreationInfo: SafeCreationInfoResponse = await safeService.getSafeCreationInfo(safeAddress)

    console.log({safeCreationInfo})

    const { transactionHash } = safeCreationInfo

    const safeCreationTx = await originalChainProvider.getTransaction(transactionHash)

    console.log({safeCreationTx})

    const reCreateSafeTx = {
        to: proxyFactoryAddress,
        data: safeCreationTx.data,
        value: 0,
    }

    // Connect to the recovery chain

    const recoveryChainProivder = new ethers.providers.JsonRpcProvider(recoveryChain.rpc)


    const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, recoveryChainProivder)

    const result = await owner1Signer.sendTransaction(reCreateSafeTx)

    console.log({result})

}

recreateSafe(CHAINS[ORIGINAL_CHAIN_ID], CHAINS[RECOVERY_CHAIN_ID])