---
id: services_transactions
title: Transactions service
sidebar_label: Transactions service
---

Keeps track of transactions sent via Gnosis Safe contracts. It uses events and [tracing](https://wiki.parity.io/JSONRPC-trace-module).

Transactions are detected in an automatic way, so there is no need of informing the service about the transactions as in
previous versions of the *Transaction Service*

- [GitHub](https://github.com/gnosis/safe-transaction-service)

- [Releases](https://github.com/gnosis/safe-transaction-service/releases)

- [Swagger (Mainnet version)](https://safe-transaction.gnosis.io/)

- [Swagger (Rinkeby version)](https://safe-transaction.rinkeby.gnosis.io/)

- [Safe Contracts and addresses on networks](https://github.com/gnosis/safe-contracts/releases)

## Setup
This is the recommended configuration for running a production Transaction service. <span style="color:#DB3A3D">`docker-compose`</span> is required
for running the project.

Configure the parameters needed on <span style="color:#DB3A3D">`.env`</span>. These parameters **need to be changed**:
- <span style="color:#DB3A3D">`ETHEREUM_NODE_URL`</span>: Http/s address of a ethereum node. It can be the same than <span style="color:#DB3A3D">`ETHEREUM_TRACING_NODE_URL`</span>.
- <span style="color:#DB3A3D">`ETHEREUM_TRACING_NODE_URL`</span>: Http/s address of a Ethereum Parity node with
[tracing enabled](https://wiki.parity.io/JSONRPC-trace-module).

If you need the Usd conversion for tokens don't forget to configure:
- <span style="color:#DB3A3D">`ETH_UNISWAP_FACTORY_ADDRESS`</span>: Checksummed address of Uniswap Factory contract.
- <span style="color:#DB3A3D">`ETH_KYBER_NETWORK_PROXY_ADDRESS`</span>: Checksummed address of Kyber Network Proxy contract.

For more parameters check <span style="color:#DB3A3D">`base.py`</span> file.

Then:
```bash
docker-compose build --force-rm
docker-compose up
```

The service should be running in <span style="color:#DB3A3D">`localhost:8000`</span>. You can test everything is set up:

```bash
curl 'http://localhost:8000/api/v1/about/'
```

For example, to set up a Göerli node:

Run a Parity node in your local computer:
```bash
parity --chain goerli --tracing on --db-path=/media/ethereum/parity --unsafe-expose
```

Edit <span style="color:#DB3A3D">`.env`</span> so docker points to he host Parity:
```
ETHEREUM_NODE_URL=http://172.17.0.1:8545
ETHEREUM_TRACING_NODE_URL=http://172.17.0.1:8545
```

Then:
```bash
docker-compose build --force-rm
docker-compose up
```

## API Endpoints


**Types**

<span style="color:#DB3A3D">`address`</span> - hexadecimal string which represents an address with checksum and 0x prefix <span style="color:#DB3A3D">`hex` </span>- hexadecimal string starting by 0x prefix <span style="color:#DB3A3D">`stringified-int`</span> - stringified int, base 10

---
**/api/v1/safes/{address}/balances GET**


Get balances for ether and every token held by a Safe

*Returns:*

 HTTP 200
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

**/api/v1/safes/{address}/balances/usd/ GET**

Get balances for ether and every token held by a Safe in usd

 *Returns:*


 HTTP 200

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
**/api/v1/safes/{address}/incoming-transactions/ GET**

Get incoming transactions (ether and ERC20 transfers) for a Safe

*Returns:*

HTTP 200

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
**/api/v1/safes/{address}/transactions/ GET**

Get transactions for a Safe

*Returns:*

HTTP 200

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
**/api/v1/transactions/{safe-tx-hash}/ GET**

Get transaction by internal SafeTxHash

*Returns:*

HTTP 200

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
