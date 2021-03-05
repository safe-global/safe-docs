---
id: tutorial_tx_service_initiate_sign
title: Initiate and sign transactions with the Safe transaction service
sidebar_label: Initiate Transactions
---

The Gnosis Safe transaction service keeps track of transactions sent via Gnosis Safe contracts. It uses events and transaction tracing to index the txs. It is used by Gnosis Safe UIs (Web interface/iOS/Android clients) to retrieve transaction information and to exchange off-chain signatures.

Transactions are detected in an automatic way, so there is no need of informing the service about the transactions as in previous versions of the Transaction Service.

Transactions can also be sent to the service to allow offchain collecting of signatures or informing the owners about a transaction that is pending to be sent to the blockchain.

Source code can be found in https://github.com/gnosis/safe-transaction-service

Gnosis is currently running the backend for these Ethereum networks:
- Mainnet:https://safe-transaction.mainnet.gnosis.io/
- Rinkeby: https://safe-transaction.rinkeby.gnosis.io/
- Goerli: https://safe-transaction.goerli.gnosis.io/
- xDai:https://safe-transaction.xdai.gnosis.io/
- EWC: https://safe-transaction.ewc.gnosis.io/
- Volta: https://safe-transaction.volta.gnosis.io/

## Proposing transactions

This tutorial will teach you how to propose transactions to the transaction service, there are 2 reasons you would want to do that:
- The transactions appear on the UIs, so you can craft custom transactions that can be signed and send by any of the owners in any of the UIs.
- As a way to collect offchain signatures (instead of calling `approveHash` method on the Safe contract with every owner) and save gas.

### Proposing transactions using Javascript

If you can code in Javascript, you can edit this example to fit your needs:
https://gist.github.com/rmeissner/0fa5719dc6b306ba84ee34bebddc860b

## Fields required for a Safe Transaction
This is the JSON structure of a Safe Transaction. All the ethereum addresses [need to be checksummed](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md):

```json
{
  "to": "<checksummed address>",
  "value": 0, // Value in wei
  "data": "<0x prefixed hex string>",
  "operation": 0,  // 0 CALL, 1 DELEGATE_CALL
  "gasToken": "<checksummed address>", // Token address (hold by the Safe) to be used as a refund to the sender, if `null` is Ether
  "safeTxGas": 0,  // Max gas to use in the transaction
  "baseGas": 0,  // Gast costs not related to the transaction execution (signature check, refund payment...)
  "gasPrice": 0,  // Gas price used for the refund calculation
  "refundReceiver": "<checksummed address>", //Address of receiver of gas payment (or `null` if tx.origin)
  "nonce": 0,  // Nonce of the Safe, transaction cannot be executed until Safe's nonce is not equal to this nonce
  "contractTransactionHash": "string",  // Contract transaction hash calculated from all the field
  "sender": "<checksummed address>",  // Owner of the Safe proposing the transaction. Must match one of the signatures
  "signature": "<0x prefixed hex string>",  // One or more ethereum ECDSA signatures of the `contractTransactionHash` as an hex string
  "origin": "string"  // Give more information about the transaction, e.g. "My Custom Safe app"
}
```

Some fields are related to the refund payment (sender of the transaction gets a refund of the estimated cost of the transaction by the Safe). If this feature is not needed
you can set these fields like this:
```json
{
    "gasToken": null,
    "baseGas": 0,
    "gasPrice": 0,
    "refundReceiver": null
}
```

## Preparing a transaction
Through this tutorial we will prepare a custom transaction for a Rinkeby Safe. Let's say we want to send `1 ether` to `0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1` and
we don't need refund for the sender. Safe is `0x03c6dda6C17353e821bCb59e419f961a30BC7F78` and one of the owners is `0x6a2EB7F6734F4B79104A38Ad19F1c4311e5214c8` with a
private key of `0x66e91912f68828c17ad3fee506b7580c4cd19c7946d450b4b0823ac73badc878`

## Get current Safe nonce

Call https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/0x03c6dda6C17353e821bCb59e419f961a30BC7F78/ to get information about the Safe:

```json
{
    "address": "0x03c6dda6C17353e821bCb59e419f961a30BC7F78",
    "nonce": 5,
    "threshold": 1,
    "owners": [
        "0x6a2EB7F6734F4B79104A38Ad19F1c4311e5214c8",
    ],
    "masterCopy": "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F",
    "modules": [ ],
    "fallbackHandler": "0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44",
    "version": "1.1.1"
}
```

Current nonce is `5`.

# Getting gas estimation

If it's available on the network, you can use the **Gnosis Safe Relay Service** to get the gas estimation for the transaction. Currently Safe Relay is depoyed on the following networks:
- Mainnet: https://safe-relay.mainnet.gnosis.io/
- Rinkeby: https://safe-relay.rinkeby.gnosis.io/
- Goerli: https://safe-relay.goerli.gnosis.io/

For estimating, relay requires a small subset of the Safe Transaction:
```json
{
  "to": "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
  "value": 1000000000000000000,
  "data": null,
  "operation": 0,  // 0 CALL, 1 DELEGATE_CALL
  "gasToken": null
}
```

POST that json to https://safe-relay.rinkeby.gnosis.io/api/v2/safes/0x03c6dda6C17353e821bCb59e419f961a30BC7F78/transactions/estimate/ and you will get:
```json
{
  "safeTxGas": "43845",
  "baseGas": "54960",
  "dataGas": "54960",
  "operationalGas": "0",
  "gasPrice": "16666666667",
  "lastUsedNonce": 4,
  "gasToken": "0x0000000000000000000000000000000000000000",
  "refundReceiver": "0x07fd2865c8DE725B4e1f4E2B72E5c654baA7c4b3"
}
```

Ignore most of the fields as we will not use the Relay and we don't need the refund parameters it provides.
Just get `safeTxGas`. You can also get `nonce` from here (adding `+ 1`) and skip the previous step.

If there's no available Relay for the Ethereum network you are using, you can call `requiredTxGas` [on the
contract](https://github.com/gnosis/safe-contracts/blob/v1.1.1/contracts/GnosisSafe.sol),
or just provide `0` so a regular estimation is done.

## Get the contractTransactionHash
### Calling the contract
Contract transaction hash is calculated using the structured data hashing defined on [EIP712](https://eips.ethereum.org/EIPS/eip-712).
You can take a look on [how is calculated on the contract](https://github.com/gnosis/safe-contracts/blob/development/contracts/GnosisSafe.sol#L403).
You can call `getTransactionHash` on your Safe contract to get the hash of the transaction. In the fields where an address is expected
but you don't want to use one (like `refundReceiver`) use an address with all zeroes (`address(0)` in Solidity).

Transaction hash would be `0x1ed9d878f89585977e98425d5cedf51027c041e414bb471d64519f8f510bb555`

### Lazy way
This way is not recommended, as it requires you to trust the server and you can easily sign a malicious transaction. For this way to work, just set
a random `contractTransactionHash` and `signature`, so the server complains with the expected `contractTransactionHash`.

The transaction would be:
```json
{
  "to": "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
  "value": 1000000000000000000,
  "data": null,
  "operation": 0,  // 0 CALL
  "gasToken": null,
  "safeTxGas": 43845,
  "baseGas": 0,
  "gasPrice": 0,
  "refundReceiver": null,
  "nonce": 5,
  "contractTransactionHash": "0xd112233445566778899aabbccddff00000000000000000000000000000000000",  // We still don't know the transaction hash
  "sender": "0x6a2EB7F6734F4B79104A38Ad19F1c4311e5214c8",
  "signature": "0x000000000000000000000000a935484ba4250c446779d4703f1598dc2ea00d12000000000000000000000000000000000000000000000000000000000000000001",  // As we don't know the `contractTransactionHash` we cannot sign it yet
  "origin": "Tx Service Tutorial"
}
```

`POST` that json to https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/0x03c6dda6C17353e821bCb59e419f961a30BC7F78/multisig-transactions/

You will receive an error:
```json
{
  "nonFieldErrors": [
    "Contract-transaction-hash=0x1ed9d878f89585977e98425d5cedf51027c041e414bb471d64519f8f510bb555 does not match provided contract-tx-hash=0xd112233445566778899aabbccddff00000000000000000000000000000000000"
  ]
}
```

Transaction hash would be `0x1ed9d878f89585977e98425d5cedf51027c041e414bb471d64519f8f510bb555`

## Sign
We should then use `0x1ed9d878f89585977e98425d5cedf51027c041e414bb471d64519f8f510bb555` as the `contractTransactionHash` and sign it with our private key. You can use `Python3` for that:
```bash
pip install eth_account
python3
```

```python
from eth_account import Account
from hexbytes import HexBytes
contract_transaction_hash = HexBytes('0x1ed9d878f89585977e98425d5cedf51027c041e414bb471d64519f8f510bb555')
account = Account.from_key('0x66e91912f68828c17ad3fee506b7580c4cd19c7946d450b4b0823ac73badc878')
signature = account.signHash(contract_transaction_hash)
print(signature.signature.hex())
```

Signature is
`0xc0df6a1b659d56d3d23f66cbd1c483467ea68a428fea7bbbe0a527d43d8681f616af33344035f36c08218718480374dada0fe6cdb266d0182a4225d0e9c227181b`.

Our transaction is complete now:
```json
{
  "to": "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
  "value": 1000000000000000000,
  "data": null,
  "operation": 0,
  "gasToken": null,
  "safeTxGas": 500000,  // Random estimation
  "baseGas": 0,
  "gasPrice": 0,
  "refundReceiver": null,
  "nonce": 5,
  "contractTransactionHash": "0x1ed9d878f89585977e98425d5cedf51027c041e414bb471d64519f8f510bb555",
  "sender": "0x6a2EB7F6734F4B79104A38Ad19F1c4311e5214c8",
  "signature": "0xc0df6a1b659d56d3d23f66cbd1c483467ea68a428fea7bbbe0a527d43d8681f616af33344035f36c08218718480374dada0fe6cdb266d0182a4225d0e9c227181b",
  "origin": "Tx Service Tutorial"
}
```

We can `POST` the json to
https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/0x03c6dda6C17353e821bCb59e419f961a30BC7F78/multisig-transactions/
