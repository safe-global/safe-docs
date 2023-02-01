# Different Ways to Create a Safe

Here are some different ways to create a Safe account:

## [Safe Core SDK](https://github.com/safe-global/safe-core-sdk)

```typescript
// yarn install ethers @safe-global/safe-core-sdk @safe-global/safe-ethers-lib
import { ethers } from 'ethers'
import Safe, { SafeFactory } from '@safe-global/safe-core-sdk'
import EthersAdapter from '@safe-global/safe-ethers-lib'

const provider = new ethers.providers.JsonRpcProvider("..."); //1
const signerWallet = new ethers.Wallet("<PRIVATE_KEY>", provider); //2
const ethAdapter = new EthersAdapter({ethers, signerOrProvider: signerWallet}); //3

const safeFactory = await SafeFactory.create({ ethAdapter }); //4
const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig: { threshold: 2, owners: ['0x...', '0x...', '0x..'] }}); //5
```

## Command Line

### [Safe CLI](https://github.com/5afe/safe-cli): Python

```bash
pip3 install -U safe-cli
safe-creator <node_url> <private_key> --owners <checksummed_address_1> <checksummed_address_2>\
 --threshold <uint> --salt-nonce <uint256>
```

### [Safe Tasks](https://github.com/5afe/safe-tasks): Node

```bash
git clone https://github.com/5afe/safe-tasks
yarn install
cat "export PK=<YOUR_PRIVATE_KEY>" > .env
cat "export NODE_URL=<YOUR_NODE_URL>" >> .env


yarn safe create
```
