import { Tabs, Steps } from 'nextra/components'
import { Grid } from '@mui/material'
import CustomCard from '../../../components/CustomCard'

# How to create and use a Safe account with the Safe4337Pack

In this guide, you will learn how you can create and use Safe accounts with the Safe ERC-4337 compatible module through the `safe-core-sdk`

This guide focuses on how user operations are built and what happens under the hood when a Safe is configured and deployed with the `Safe4337Module` enabled.

The 4337 utils lives in the `relay-kit` package as we are basically relaying transactions to a bundler.

For this guide, we are going to use Pimlico as a provider but this is completely optional and you can use any other provider that supports bundling and/or paymaster services.

## Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
- A [Pimlico account](https://dashboard.pimlico.io) and an API key.

## Steps

<Steps>

### Install dependencies

Install the `relay-kit` package

```bash
yarn add ethers @safe-global/protocol-kit @safe-global/relay-kit@2.1.0-alpha.0
```

### Imports

These are all the imports required in the script we are building for this guide

```typescript
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { Safe4337Pack } from "@safe-global/relay-kit";
```

### Create a signer (EthersAdapter)

First, we need a signer instance that will be the owner of the Safe account once it is deployed. We are using here the `EthersAdapter` from the `protocol-kit` package to create a signer from a private key.

```typescript
const PRIVATE_KEY = "0x...";
const RPC_URL = "https://...";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const ethersAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer,
});
```

### Initialize Safe4337Pack

In order to generate an instance of the `Safe4337Pack`, we need to use the static `init()` method. Depending on what you want to do there are different options to pass to the `init()` method and to cover several use cases.

</Steps>
