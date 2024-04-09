# Interacting with API

This section shows some examples of how to interact with the Safe Transaction Service API in different situations.

The examples have been proposed using [Curl](https://github.com/curl/curl) requests, the [Safe Apps SDK](https://github.com/safe-global/safe-apps-sdk) and the [safe-eth-py](https://github.com/safe-global/safe-eth-py) python library.

## Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).
2. [Python](https://www.python.org/downloads/) >= 3.9 (If using `safe-eth-py`).
3. Have a Safe configured with threshold equal to 2, where 2 signatures are needed to execute transactions.

## Install dependencies

```bash
yarn add ethers @safe-global/api-kit @safe-global/protocol-kit @safe-global/safe-core-sdk-types
```

```bash
pip install safe-eth-py web3 hexbytes
```

## Examples

### Creating a transaction and sending offchain signatures from the owners

#### Using Curl

- Create transaction

```bash
curl -X 'POST' \
'https://safe-transaction-sepolia.safe.global/api/v1/safes/0xc62C5cbB964ffffffffff82f78A4d30713174b2E/multisig-transactions/' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
    "safe": "0xc62C5cbB964459F3C984682f78A4d3ffffffffff",
    "to": "0x795D6C88B4Ea3CCffffffffffCa8a11Bc0496228",
    "value": 2000000000000000,
    "data": null,
    "operation": 0,
    "gasToken": "0x0000000000000000000000000000000000000000",
    "safeTxGas": 0,
    "baseGas": 0,
    "gasPrice": 0,
    "refundReceiver": "0x0000000000000000000000000000000000000000",
    "nonce": 15,
    "contractTransactionHash": "0x56b2931d1053b6afffffffffff3ba29b5c2baafdf1a588850da72a62674941b6",
    "sender": "0xAA86E576c084aCFa56fc4D0E17967ffffffffff8",
    "signature": "0x6a2b57023af16241511619ea95f7cd03d00aa6b79d1ca80e21a0b89cd2c38ffffffffff9b738ffbd680c4d717b9b0c9eae568f3edebc40a0c004700bffffffffff"
}'
```

- Add signatures to transaction

```bash
curl -X 'POST' \
'https://safe-transaction-sepolia.safe.global/api/v1/multisig-transactions/0x56b2931ffffffffff303bbaadf3ba29b5c2baafdf1a5ffffffffff62674941b6/confirmations/' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
    "signature": "0x8c41aaa029db2942a1574c3ec9442b80764e953f21f994edb641d33ffffffffffa55ffffffffffefcaea5b3360bd4c789803fe289b2ad467fc9b3bedb479dad20"
}'
```

#### Using safe-core-sdk

```typescript
import { ethers } from 'ethers'
import SafeApiKit from '@safe-global/api-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import {
  MetaTransactionData,
  OperationType
} from '@safe-global/safe-core-sdk-types'

async function createTransactionAndSignByOwners() {
  // Instantiate an EthAdapter for Owner A
  const ethProvider = new ethers.JsonRpcProvider(config.RPC_URL)

  const ownerA = new ethers.Wallet(config.OWNER_A_PRIVATE_KEY, ethProvider)
  const ethAdapterOwnerA = new EthersAdapter({
    ethers,
    signerOrProvider: ownerA
  })

  // Initialize the Protocol Kit for Owner A
  const protocolKitOwnerA = await Safe.create({
    ethAdapter: ethAdapterOwnerA,
    safeAddress: config.SAFE_ADDRESS
  })

  // Create Tx
  const safeTransactionData: MetaTransactionData = {
    to: config.TO,
    value: config.VALUE,
    data: '0x',
    operation: OperationType.Call
  }

  const safeTransaction = await protocolKitOwnerA.createTransaction({
    transactions: [safeTransactionData]
  })

  console.log('Tx created: %O', safeTransaction)

  // Sign Tx by Owner A
  const safeTxHash = await protocolKitOwnerA.getTransactionHash(safeTransaction)
  const signatureOwnerA = await protocolKitOwnerA.signHash(safeTxHash)

  console.log('Tx signed by Owner A: %s', signatureOwnerA.data)

  // Initialize the Api Kit
  const apiKit = new SafeApiKit({
    chainId: 11155111n
  })

  // Create a Tx in Tx service with Signature of Owner A
  const senderAddress = await ownerA.getAddress()

  await apiKit.proposeTransaction({
    safeAddress: config.SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress,
    senderSignature: signatureOwnerA.data
  })

  console.log('Tx proposed: %s', safeTxHash)

  // Instantiate an EthAdapter for Owner B
  const ownerB = new ethers.Wallet(config.OWNER_B_PRIVATE_KEY, ethProvider)
  const ethAdapterOwnerB = new EthersAdapter({
    ethers,
    signerOrProvider: ownerB
  })

  // Initialize the Protocol Kit for Owner B
  const protocolKitOwnerB = await Safe.create({
    ethAdapter: ethAdapterOwnerB,
    safeAddress: config.SAFE_ADDRESS
  })

  // Sign Tx by Owner B
  const signatureOwnerB = await protocolKitOwnerB.signHash(safeTxHash)

  console.log('Tx signed by Owner B: %s', signatureOwnerB.data)

  // Add signature of owner B in Tx service
  await apiKit.confirmTransaction(safeTxHash, signatureOwnerB.data)

  console.log('Tx Owner B signature added in Tx service.')
}
```

It is also possible to group multiple transactions into a single transaction and execute them in batch mode. To do so, just define the transactions as follows:

```typescript
// Create Tx
const safeTransactionData: MetaTransactionData = {
  to: config.TO,
  value: config.VALUE,
  data: '0x',
  operation: OperationType.Call
}

const safeTransactionBData: MetaTransactionData = {
  to: config.TO_B,
  value: config.VALUE,
  data: '0x',
  operation: OperationType.Call
}

const safeTransaction = await protocolKitOwnerA.createTransaction({
  transactions: [safeTransactionData, safeTransactionBData]
})
```

#### Using safe-eth-py

```python
from gnosis.eth import EthereumClient, EthereumNetwork
from gnosis.safe.api.transaction_service_api import TransactionServiceApi
from gnosis.safe import Safe
from hexbytes import HexBytes

def create_transaction_and_sign_by_owners():
    # Instantiate a Safe
    ethereum_client = EthereumClient(config.get("RPC_URL"))
    safe = Safe(config.get("SAFE_ADDRESS"), ethereum_client)

    # Create a Tx
    safe_tx = safe.build_multisig_tx(config.get("TO"), config.get("VALUE"), HexBytes(""))

    # Sign Tx by Owner A
    safe_tx.sign(config.get("OWNER_A_PRIVATE_KEY"))

    # Instantiate a Tx Service Api
    transaction_service_api = TransactionServiceApi(
        network=EthereumNetwork.SEPOLIA,
        ethereum_client=ethereum_client
    )

    # Send Tx to Tx Service
    transaction_service_api.post_transaction(safe_tx)

    # Get Tx from Tx Service
    (safe_tx_from_tx_service, _) = transaction_service_api.get_safe_transaction(safe_tx.safe_tx_hash)

    # Sign Tx by Owner B
    owner_b_signature = safe_tx_from_tx_service.sign(config.get("OWNER_B_PRIVATE_KEY"))

    # Add signature of owner B in Tx service
    transaction_service_api.post_signatures(safe_tx_from_tx_service.safe_tx_hash, owner_b_signature)

    (safe_signed_tx_from_tx_service, _) = transaction_service_api.get_safe_transaction(safe_tx_from_tx_service.safe_tx_hash)

    print(f"Tx created: {safe_signed_tx_from_tx_service}")
```

### Getting a transaction using safe transaction hash and executing it

#### Using Curl

```bash
curl -X 'GET' \
'https://safe-transaction-sepolia.safe.global/api/v1/multisig-transactions/0xe4ceea4ffffffffff0c9ce0af82780ffffffffffd3096836fff2528cb90d156/' \
-H 'accept: application/json' \
```

#### Using safe-core-sdk

```typescript
import { ethers } from 'ethers'
import SafeApiKit from '@safe-global/api-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'

async function getAndExecuteSignedTx(safeTxHash: string) {
  // Initialize the Api Kit
  const apiKit = new SafeApiKit({
    chainId: 11155111n
  })

  // Get signed Tx
  const signedTransaction = await apiKit.getTransaction(safeTxHash)

  // Log Tx confirmations
  const confirmations = signedTransaction.confirmations
  console.log('Tx hash %s confirmations: %O', safeTxHash, confirmations)

  // Instantiate an EthAdapter for Owner A
  const ethProvider = new ethers.JsonRpcProvider(config.RPC_URL)

  const ownerA = new ethers.Wallet(config.OWNER_A_PRIVATE_KEY, ethProvider)
  const ethAdapterOwnerA = new EthersAdapter({
    ethers,
    signerOrProvider: ownerA
  })

  // Initialize the Protocol Kit for Owner A
  const protocolKitOwnerA = await Safe.create({
    ethAdapter: ethAdapterOwnerA,
    safeAddress: config.SAFE_ADDRESS
  })

  // Execute Tx
  const transactionResponse =
    await protocolKitOwnerA.executeTransaction(signedTransaction)
  console.log('Executed Tx: %O', transactionResponse)
}
```

#### Using safe-eth-py

```python
from gnosis.eth import EthereumClient, EthereumNetwork
from gnosis.safe.api.transaction_service_api import TransactionServiceApi

def get_and_execute_signed_tx(safe_tx_hash):
    # Instantiate a Tx Service Api
    ethereum_client = EthereumClient(config.get("RPC_URL"))

    transaction_service_api = TransactionServiceApi(
        network=EthereumNetwork.SEPOLIA,
        ethereum_client=ethereum_client
    )

    # Get Tx from Tx Service
    (safe_tx_from_tx_service, _) = transaction_service_api.get_safe_transaction(safe_tx_hash)

    # Execute Tx
    result = safe_tx_from_tx_service.execute(config.get("OWNER_A_PRIVATE_KEY"))
    print(f"Tx executed: {result}")
```

### Getting the last executed multisig transaction

#### Using Curl

```bash
curl -X 'GET' \
'https://safe-transaction-sepolia.safe.global/api/v1/safes/0xc62C5cbB96ffffffffffff2f78A4d3071317ffff/multisig-transactions/?executed=true&limit=1' \
-H 'accept: application/json' \
```

#### Using safe-core-sdk

```typescript
import SafeApiKit from '@safe-global/api-kit'

async function getLastExecutedTx() {
  const apiKit = new SafeApiKit({
    chainId: 11155111n
  })

  const transactions = await apiKit.getMultisigTransactions(config.SAFE_ADDRESS)

  if (transactions.results.length > 0) {
    console.log('Las executed TX: %O', transactions.results[0])
    return
  }

  console.log('No Tx found')
}
```

#### Using safe-eth-py

```python
from gnosis.eth import EthereumClient, EthereumNetwork
from gnosis.safe.api.transaction_service_api import TransactionServiceApi

def get_last_executed_tx():
    # Instantiate a Tx Service Api
    ethereum_client = EthereumClient(config.get("RPC_URL"))
    transaction_service_api = TransactionServiceApi(
        network=EthereumNetwork.SEPOLIA,
        ethereum_client=ethereum_client
    )

    # Get Tx from Tx Service
    transactions = transaction_service_api.get_transactions(config.get("SAFE_ADDRESS"))
    last_executed_tx = next((x for x in transactions if x.get('isExecuted')), None)

    print("Last executed Tx: %O", last_executed_tx)
```

### Creating a message and sending offchain signatures

#### Using Curl

- Create a new message

```bash
curl -X 'POST' \
'https://safe-transaction-sepolia.safe.global/api/v1/safes/0xc62C5cbB964459Fffffffffffffffffffff74b2E/messages/' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
    "message": "A Safe Message",
    "signature": "0xc8bff3e71314f8b79f6e31ae38c5efba1194e61e8ba6f35742f73af41d95c2fa4118bdfa5df2effffffffffffffffffffe87af26ca7d71e8f008e3bcfc25f1d31c"
}'
```

- Get message

```bash
curl -X 'GET' \
'https://safe-transaction-sepolia.safe.global/api/v1/messages/0xcf2e6b1e26e6930e14bebf120ffffffffffffffffffffb484a787137201ab0df/' \
-H 'accept: application/json' \
```

- Add signature to message

```bash
curl -X 'POST' \
'https://safe-transaction-sepolia.safe.global/api/v1/messages/0xcf2e6b1e26e6930e14bebf120ffffffffffffffffffffb484a787137201ab0df/signatures/' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
    "signature": "0xc8bff3e71314f8b79f6e31ae38c5efba1194e61e8ba6f35742f73af4ffffffffffffffffffffe5f84088ba29f51c44ddee87af26ca7d71e8f008e3bcfc25f1d31c"
}'
```

#### Using safe-core-sdk

```typescript
import { ethers } from 'ethers'
import SafeApiKit, { AddMessageProps } from '@safe-global/api-kit'
import Safe, { EthersAdapter, hashSafeMessage } from '@safe-global/protocol-kit'

async function createMessageAndSignByOwners() {
  // Instantiate an EthAdapter for Owner A
  const ethProvider = new ethers.JsonRpcProvider(config.RPC_URL)

  const ownerA = new ethers.Wallet(config.OWNER_A_PRIVATE_KEY, ethProvider)
  const ethAdapterOwnerA = new EthersAdapter({
    ethers,
    signerOrProvider: ownerA
  })

  // Initialize the Protocol Kit for Owner A
  const protocolKitOwnerA = await Safe.create({
    ethAdapter: ethAdapterOwnerA,
    safeAddress: config.SAFE_ADDRESS
  })

  const rawMessage: string = 'A Safe Message - ' + Date.now()

  // Create Safe Message
  const safeMessage = protocolKitOwnerA.createMessage(rawMessage)

  console.log('Message created: %O', safeMessage)

  const signedMessageOwnerA = await protocolKitOwnerA.signMessage(safeMessage)

  console.log(
    'Message signed by Owner A: %s',
    signedMessageOwnerA.encodedSignatures()
  )

  // Initialize the Api Kit
  const apiKit = new SafeApiKit({
    chainId: 11155111n
  })

  // Add Message to Tx service
  const messageProps: AddMessageProps = {
    message: rawMessage,
    signature: signedMessageOwnerA.encodedSignatures()
  }

  apiKit.addMessage(config.SAFE_ADDRESS, messageProps)

  console.log('Message proposed to Safe Tx service')

  // Instantiate an EthAdapter for Owner B
  const ownerB = new ethers.Wallet(config.OWNER_B_PRIVATE_KEY, ethProvider)
  const ethAdapterOwnerB = new EthersAdapter({
    ethers,
    signerOrProvider: ownerB
  })

  // Initialize the Protocol Kit for Owner B
  const protocolKitOwnerB = await Safe.create({
    ethAdapter: ethAdapterOwnerB,
    safeAddress: config.SAFE_ADDRESS
  })

  // Sign Blockchain Message by Owner B
  const signedMessageOwnerB = await protocolKitOwnerB.signMessage(safeMessage)

  console.log(
    'Message signed by Owner B: %s',
    signedMessageOwnerB.encodedSignatures()
  )

  // Add signature of owner B in Safe Tx service
  const safeMessageHash = await protocolKitOwnerB.getSafeMessageHash(
    hashSafeMessage(rawMessage)
  )
  const ownerBAddress = (await ethAdapterOwnerB.getSignerAddress()) || '0x'
  await apiKit.addMessageSignature(
    safeMessageHash,
    signedMessageOwnerB.getSignature(ownerBAddress)?.data || '0x'
  )

  console.log('Message Owner B signature added to Tx service.')
}
```

### Manage user delegates

#### Using Curl

- Get delegates for delegator

```bash
curl -X 'GET' \
'https://safe-transaction-sepolia.safe.global/api/v1/delegates/?delegator=0xAA86E576c084aFFFFFFFFFFFF7967F10C467d318' \
-H 'accept: application/json'
```

- Add delegate for delegator

```bash
curl -X 'POST' \
'https://safe-transaction-sepolia.safe.global/api/v1/delegates/' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
    "delegate": "0x634Ce7818a1Ca34d3D69FFFFFFFFFFFFFFFF0AC6",
    "delegator": "0xAA86E576c084aFFFFFFFFFFFF7967F10C467d318",
    "signature": "0xe026c189805d7d5026e8b33e03dfe1847a488a9c6846afefffffffffffff0a566af485b7b4a68189c69c2245fcb9321d718d829d6180245cfe56dc51a0c15b031b",
    "label": "User delegator label"
}'
```

- Delete delegate for delegator

```bash
curl -X 'DELETE' \
'https://safe-transaction-sepolia.safe.global/api/v1/delegates/0x634Ce7818a1Ca34d3D69FFFFFFFFFFFFFFFF0AC6/' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
    "delegate": "0x634Ce7818a1Ca34d3D69FFFFFFFFFFFFFFFF0AC6",
    "delegator": "0xAA86E576c084aFFFFFFFFFFFF7967F10C467d318",
    "signature": "0xe026c189805d7d5026e8b33e03dfe1847a488a9c6846afefffffffffffff0a566af485b7b4a68189c69c2245fcb9321d718d829d6180245cfe56dc51a0c15b031b"
}'
```

#### Using safe-core-sdk

```typescript
import { ethers } from 'ethers'
import SafeApiKit, { AddSafeDelegateProps } from '@safe-global/api-kit'
import { EthersAdapter } from '@safe-global/protocol-kit'

async function manageDelegates() {
  // Instantiate an EthAdapter for Owner A
  const ethProvider = new ethers.JsonRpcProvider(config.RPC_URL)

  const ownerA = new ethers.Wallet(config.OWNER_A_PRIVATE_KEY, ethProvider)
  const ethAdapterOwnerA = new EthersAdapter({
    ethers,
    signerOrProvider: ownerA
  })

  // Initialize the Api Kit
  const apiKit = new SafeApiKit({
    chainId: 11155111n
  })

  const ownerAAddress = await ethAdapterOwnerA.getSignerAddress()

  const delegates = await apiKit.getSafeDelegates({
    delegatorAddress: ownerAAddress
  })

  console.log('Delegates for Owner A: %O ', delegates.results)

  // Instantiate an EthAdapter for Owner B
  const ownerB = new ethers.Wallet(config.OWNER_B_PRIVATE_KEY, ethProvider)
  const ethAdapterOwnerB = new EthersAdapter({
    ethers,
    signerOrProvider: ownerB
  })

  const ownerBAddress = await ethAdapterOwnerB.getSignerAddress()

  // Add Owner B as Owner A delegate for all safes (safeAddress = null)
  const delegateConfig: AddSafeDelegateProps = {
    delegateAddress: ownerBAddress || '0x',
    delegatorAddress: ownerAAddress || '0x',
    signer: ownerA,
    label: 'Label'
  }

  const safeDelegateAddResponse = await apiKit.addSafeDelegate(delegateConfig)

  console.log(
    'Add Owner B as delegate of Owner A: %O ',
    safeDelegateAddResponse
  )

  const delegatesAfterAdd = await apiKit.getSafeDelegates({
    delegatorAddress: ownerAAddress
  })

  console.log('Delegates for Owner A: %O ', delegatesAfterAdd.results)

  await apiKit.removeSafeDelegate(delegateConfig)

  console.log('Remove Owner B as delegate of Owner A')

  const delegatesAfterRemove = await apiKit.getSafeDelegates({
    delegatorAddress: ownerAAddress
  })

  console.log('Delegates for Owner A: %O ', delegatesAfterRemove.results)
}
```

#### Using safe-eth-py

```python
from gnosis.eth import EthereumClient, EthereumNetwork
from gnosis.safe.api.transaction_service_api import TransactionServiceApi
from eth_account import Account
from eth_typing import ChecksumAddress

def manage_delegates():
    # Instantiate a Tx Service Api
    ethereum_client = EthereumClient(config.get("RPC_URL"))
    transaction_service_api = TransactionServiceApi(
        network=EthereumNetwork.SEPOLIA,
        ethereum_client=ethereum_client
    )

    # Get delegates for Safe
    delegates_for_safe = transaction_service_api.get_delegates(config.get("SAFE_ADDRESS"))
    print(f'Delegates for safe {config.get("SAFE_ADDRESS")}: {delegates_for_safe}')

    # Add Owner B as delegate of Owner A in Safe
    account_owner_a = Account.from_key(config.get("OWNER_A_PRIVATE_KEY"))
    account_owner_b = Account.from_key(config.get("OWNER_B_PRIVATE_KEY"))
    transaction_service_api.add_delegate(
        safe_address=ChecksumAddress(config.get("SAFE_ADDRESS")),
        delegate_address=ChecksumAddress(account_owner_b.address),
        label="",
        signer_account=account_owner_a)

    # Get delegates for Safe
    delegates_for_safe = transaction_service_api.get_delegates(config.get("SAFE_ADDRESS"))
    print(f'Delegates for safe {config.get("SAFE_ADDRESS")}: {delegates_for_safe}')

    # Remove Owner B as delegate of Owner A in Safe
    transaction_service_api.remove_delegate(
        safe_address=ChecksumAddress(config.get("SAFE_ADDRESS")),
        delegate_address=ChecksumAddress(account_owner_b.address),
        signer_account=account_owner_a)

    # Get delegates for Safe
    delegates_for_safe = transaction_service_api.get_delegates(config.get("SAFE_ADDRESS"))
    print(f'Delegates for safe {config.get("SAFE_ADDRESS")}: {delegates_for_safe}')
```
