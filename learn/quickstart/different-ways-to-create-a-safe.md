# Different Ways to Create a Safe

Here are some different ways to create a Safe account:

## [Safe Core SDK](https://github.com/safe-global/safe-core-sdk)
```bash
yarn add ethers@5.7.2 @safe-global/protocol-kit \
```

```typescript
import { ethers } from 'ethers'
import Safe, { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'

const provider = new ethers.providers.JsonRpcProvider('...'); //1
const signerWallet = new ethers.Wallet('<PRIVATE_KEY>', provider); //2
const ethAdapter = new EthersAdapter({ethers, signerOrProvider: signerWallet}); //3

const safeFactory = await SafeFactory.create({ ethAdapter }); //4
const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig: { threshold: 2, owners: ['0x...', '0x...', '0x..'] }}); //5
```

## Command Line

### [Safe CLI](https://github.com/5afe/safe-cli): Python

```bash
pip3 install -U safe-cli
safe-cli <checksummed_safe_address> <ethereum_node_url>
load_cli_owners <account_private_key>
safe-creator <node_url> <private_key> --owners <checksummed_address_1> <checksummed_address_2>\
  --threshold <uint> --salt-nonce <uint256>
tx-service asign-tx <safe-tx-hash>
```

### [Safe Tasks](https://github.com/5afe/safe-tasks): Node

```bash
git clone https://github.com/5afe/safe-tasks
yarn install
cat "export PK=<YOUR_PRIVATE_KEY>" > .env
cat "export NODE_URL=<YOUR_NODE_URL>" >> .env


yarn safe create
yarn safe propose <address> --to <target>
yarn safe sign-proposal <safeTxHash>
yarn safe submit-proposal <safeTxHash>
```
