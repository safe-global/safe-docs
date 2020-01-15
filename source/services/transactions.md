# Transaction Service
Keeps track of transactions sent via Gnosis Safe contracts. It uses events and [tracing](https://wiki.parity.io/JSONRPC-trace-module).

Transactions are detected in an automatic way, so there is no need of informing the service about the transactions as in
previous versions of the *Transaction Service*

[GitHub](https://github.com/gnosis/safe-transaction-service)

[Releases](https://github.com/gnosis/safe-transaction-service/releases)

[Swagger (Mainnet version)](https://safe-transaction.gnosis.io/)

[Swagger (Rinkeby version)](https://safe-transaction.rinkeby.gnosis.io/)

[Safe Contracts and addresses on networks](https://github.com/gnosis/safe-contracts/releases)

## API Endpoints

---
### Types
`address` - hexadecimal string which represents an address with checksum and 0x prefix
`hex` - hexadecimal string starting by 0x prefix
`stringified-int` - stringified int, base 10

---
### /api/v1/safes/{address}/balances GET
Get balances for ether and every token held by a Safe

#### Returns
> HTTP 200
```js
[
    {
        "tokenAddress": "<address>",  // For ether, address(0)
        "token": {
            "name": "<string>",
            "symbol": "<string>",
            "decimals": "<int>"
        }
        "balance": "<stringified-int>"
    }
]
```

---
### /api/v1/safes/{address}/balances/usd/ GET
Get balances for ether and every token held by a Safe in usd

#### Returns
> HTTP 200
```js
[
    {
        "tokenAddress": "<address>",  // For ether, address(0)
        "token": {
            "name": "<string>",
            "symbol": "<string>",
            "decimals": "<int>"
        }
        "balance": "<stringified-int>",
        "balanceUsd": "<stringified-int>"
    }
]
```

---
### /api/v1/safes/{address}/incoming-transactions/ GET
Get incoming transactions (ether and ERC20 transfers) for a Safe

#### Returns
> HTTP 200
```js
[
    {
        "executionDate": "<string>",
        "blockNumber": "<string>",
        "transactionHash": "<hex>",
        "to": "<address>",
        "value": "<stringified-int>",
        "tokenAddress": "<address>",
        "from": "<address>"
    }
]
```

---
### /api/v1/safes/{address}/transactions/ GET
Get transactions for a Safe

#### Returns
> HTTP 200
```js
[
    {
        "safe": "<address>",
        "to": "<address>",
        "value": "<stringified-int>",
        "data": "<hex>",
        "operation": "<int>",
        "gasToken": "<address>",
        "safeTxGas": "<stringified-int>",
        "baseGas": "<stringified-int>",
        "gasPrice": "<stringified-int>",
        "refundReceiver": "<address>",
        "nonce": "<int>",
        "safeTxHash": "<hex>",
        "blockNumber": "<int>",
        "transactionHash": "<hex>",
        "submissionDate": "<string>",
        "isExecuted": "<bool>",
        "isSuccesful": "<bool>",
        "executionDate": "<string>",
        "executor": "<address>",
        "confirmations": ["<address>"],
        "signatures": "<hex>"
    }
]
```

---
### /api/v1/transactions/{safe-tx-hash}/ GET
Get transaction by internal SafeTxHash

#### Returns
> HTTP 200
```js
{
    "safe": "<address>",
    "to": "<address>",
    "value": "<stringified-int>",
    "data": "<hex>",
    "operation": "<int>",
    "gasToken": "<address>",
    "safeTxGas": "<stringified-int>",
    "baseGas": "<stringified-int>",
    "gasPrice": "<stringified-int>",
    "gasUsed": "<stringified-int>",
    "refundReceiver": "<address>",
    "nonce": "<int>",
    "safeTxHash": "<hex>",
    "blockNumber": "<int>",
    "transactionHash": "<hex>",
    "submissionDate": "<string>",
    "isExecuted": "<bool>",
    "isSuccesful": "<bool>",
    "executionDate": "<string>",
    "executor": "<address>",
    "confirmations": ["<address>"],
    "signatures": "<hex>"
}
```
