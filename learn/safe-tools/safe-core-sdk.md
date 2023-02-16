---
description: >-
  Safe Core SDK is a Typescript library for interacting with Safe Contracts
---

[safe-core-sdk](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk) is a TypeScript library for interacting with the [Safe contracts](https://github.com/safe-global/safe-contracts)

## Getting Started[](#getting-started)

This is a short tutorial on creating a multisig wallet using the core-sdk. For a more detailed guide, including how to integrate with safe-core-service and web3js, see [Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md).

## Install Dependencies

To interact with Ethreum and other EVM blockchains in Node, we can either use: web3.js or ethers.js. 
In this tutorial, we’ll use the ethers.js library because it's newer and has an easier developer experience.

The safe-core-sdk is compatible with ethers v4 and v5, not the latest v6 version so make sure you specify this when installing the SDK.

`yarn add ethers@5.7.2`


We'll store our environment variables such as Ethereum adddresses in `.env` files so let's use `dotenv`
`yarn add dotenv`.

Install the core SDKs
```bash
yarn add @safe-global/safe-core-sdk-types @safe-global/safe-core-sdk @safe-global/safe-service-client
```

We will use ethers, to see how to do the same for `web3js` see [Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md):
```bash
yarn add @safe-global/safe-ethers-lib
```

## Initialize the SDK

### Initialize an EthAdapter

```typescript
import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'

const web3Provider = // ...
const provider = new ethers.providers.Web3Provider(web3Provider)
const safeOwner = provider.getSigner(0)

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: safeOwner
})
```



