import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import SafeServiceClient from '@safe-global/safe-service-client'
import { SafeFactory, SafeAccountConfig } from '@safe-global/safe-core-sdk'

// Initialize Objects needed for the SDK

// <https://chainlist.org/?search=goerli&testnets=true>
const RPC_URL='https://eth-goerli.public.blastapi.io'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

// Initialize signers
const owner1Signer = provider.getSigner(process.env.OWNER_1_PRIVATE_KEY)
const owner2Signer = provider.getSigner(process.env.OWNER_2_PRIVATE_KEY)
const owner3Signer = provider.getSigner(process.env.OWNER_3_PRIVATE_KEY)

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})

const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter: ethAdapterOwner1 })
let safeFactory;

async function deploySafe() {
  safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })

  const safeAccountConfig: SafeAccountConfig = {
    owners: [
      await owner1Signer.getAddress(),
      await owner2Signer.getAddress(),
      await owner3Signer.getAddress()
    ],
    threshold: 2,
    // ... (Optional params)
  }

  /* This Safe is connected to owner 1 because the factory was initialized with an adapter that had owner 1 as the signer. */
  const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

  console.log('Your Safe has been deployed:')
  console.log(`https://goerli.etherscan.io/address/${safeSdkOwner1.getAddress()}`)
}
