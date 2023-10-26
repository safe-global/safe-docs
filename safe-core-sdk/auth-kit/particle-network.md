# Integration with Particle Network

This guide demonstrates how to leverage Particle Network's Wallet-as-a-Service to create an externally-owned account (EOA) using your email or social media account. Once authenticated, you can deploy and interact with Safe Smart Accounts.

## Prerequisites

- [A Particle Network account](https://dashboard.particle.network/#/)
- [Node.js](https://nodejs.org/en/download) 
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) 
- Optionally, [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

### Install dependencies

```bash
npm i @safe-global/auth-kit @particle-network/auth @particle-network/provider

# Or, if you'd like to use yarn

yarn add @safe-global/auth-kit @particle-network/auth @particle-network/provider
```

## Creating a ParticleModalPack instance

To begin, we'll be using the provided `ParticleModalPack` from the `@safe-global/auth-kit` package.

`ParticleModalPack` will be our primary means of configuration and interaction with the Particle Network integration. 

To set it up, we'll need to create an instance of [`ParticleModalPack`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/auth-kit/src/packs/particle-network/ParticleModalPack.ts) with `txServiceUrl` (in this case, https://safe-transaction-goerli.safe.global) placed within the constructor.

With an instance of `ParticleModalPack` created, passing in `txServiceUrl`, we can initialize Particle by passing a configuration object, `ParticleConfig`, into `ParticleModalPack.init()`.

```ts
import { ParticleModalPack, ParticleConfig } from '@safe-global/auth-kit'

// https://docs.particle.network/developers/auth-service/sdks/web#step-2-setup-developer-api-key
const particleConfig: ParticleConfig = {
  projectId: 'YOUR_PROJECT_ID',
  clientKey: 'YOUR_CLIENT_KEY',
  appId: 'YOUR_APP_ID',
  chainName: 'ethereum',
  chainId: 5,
}

const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
const particleModalPack = new ParticleModalPack({ txServiceUrl })

await particleModalPack.init(particleConfig)
```

## Sign in to an Ethereum account

Now that an instance of `ParticleModalPack` is created and initialized, you can use the `signIn()` method to facilitate login through the standard Particle Auth authentication menu. `signIn()` is most often assigned to something like a "Sign In" button.

Each authentication mechanism (email, Google, Twitter, etc.) results in a **constant** and **unique** externally-owned account. This account will exist across any other Particle-integrated applications & is tied directly to a specific social account relating to the chosen authentication mechanism.

```ts
// Once a user signs in, this returns the user's EOA address
// along with a list of owned Safes
const signInInfo = await particleModalPack.signIn()

/* 
When `txServiceUrl` is included within the construction of `ParticleModalPack`,
the list of associated Safe addresses will be returned as a 
part of the `signIn()` method response.
*/
```

The returned `authKitSignData` object contains the following properties:

```ts
AuthKitSignInData {
	eoa: string // The Safe signer
	safes?: string[] // The list of associated Safe addresses
}
```

The `signOut()` method closes the current session (assuming `signIn()` was called and successfully executed prior).

```ts
await particleModalPack.signOut()
```

To connect Particle to a library like Ethers.js or Web3.js, you can call `getProvider()` to retrieve an Ethereum provider instance.

```ts
await particleModalPack.getProvider()
```

Additionally, [`connect`, `disconnect`, and `chainChanged` events](https://docs.particle.network/developers/auth-service/sdks/web#status-events) can be listened to by leveraging the `subscribe()` method on `ParticleModalPack`.

```ts
// When a user successfully logs in
particleModalPack.subscribe('connect', (userInfo) => {
          console.log("User is authenticated", userInfo);
});

// When a user disconnects (logs out) from a session
particleModalPack.subscribe('disconnect', () => {
          console.log("User has disconnected");
});

// When a user has changed the chain within the Particle Wallet modal
particleModalPack.subscribe('chainChanged', (chain) => {
          console.log("User has changed chain", chain);
});
```

## Signing transactions using ParticleModalPack and Protocol Kit

`ParticleModalPack` can be used in tandem with the [Protocol Kit](../protocol-kit) to connect to a Safe using the `provider` (via `getProvider()`), and the `signer` of the currently authenticated account

Once connected, you can use any of the methods available in the [Protocol Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit#sdk-api).

```ts
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'

provider = new ethers.providers.Web3Provider(particleModalPack.getProvider())
signer = provider.getSigner()

const ethAdapter = new EthersAdapter({
	ethers,
	signerOrProvider: signer || provider
})
  
const safeSDK =  wait Safe.create({
	ethAdapter,
	safeAddress
})

// Create a Safe transaction with the provided parameters
const safeTransactionData: MetaTransactionData = {
	to: '0x',
	data: '0x',
	value: ethers.utils.parseUnits('0.0001', 'ether').toString()
}

const safeTransaction = await safeSDK.createTransaction({ safeTransactionData })
```

## Sign messages using `ParticleModalPack`

Additionally, you can also sign any message or transaction as you would traditionally (using the authenticated account as a regular signer) with your preferred web3 library.

```ts
// Using web3

const web3  =  new Web3(particleModalPack.getProvider())

await web3.eth.sendTransaction(tx) // Send transaction
await web3.eth.signTransaction(tx) // Sign transaction
const message  =  'hello world'
const address  =  '0x...'
await web3.eth.personal.sign(message, address) // Sign message

// Using ethers

const provider = new ethers.providers.Web3Provider(particleModalPack.getProvider())
const signer  = provider.getSigner()

await signer.sendTransaction(tx) // Send transaction
await signer.signTransaction(tx) // Sign transaction
await signer.signMessage(message) // Sign message

// Using Particle

const particle = new ParticleNetwork(config) // @particle-network/auth

await particle.evm.sendTransaction(tx) // Send transaction
await particle.evm.personalSign(message) // Sign message
```