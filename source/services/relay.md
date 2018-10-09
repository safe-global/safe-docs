# Transaction Relay Service
This service allows us to have owners of the safe contract that don’t need to hold any ETH on those owner addresses, why? Because the transaction relay service acts as a proxy, paying for the transaction fees and getting it back due to the transaction architecture we use.

Our target user has previous crypto in one centralized exchange (or in other Ethereum address) and want to move it to a secure account. We don’t want the user to trust us (us moving the funds, creating the funds for him) and we want to avoid users by spamming our services, don’t need to trust the user.

That’s why we came up with this solution, the user (phone app) and us (service) both generates a random signature for a valid transaction and with this valid signed transaction, anyone can submit this to the blockchain and a safe would be created with:

No one knows the private key, so no previous transaction can be sent before this tx (making it invalid).
Safe address can be derived, because it’s derived from the address of the sender (the address can be derived from the signed tx) https://Ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-Ethereum-contract-computed
This transaction will create the safe contract and refund the service with the money from the safe contract, so the service has guaranteed that if executes the tx will have to pay tx fees but will get it back from the tx execution.

Proxy used: [PayingProxy](https://github.com/gnosis/safe-contracts/blob/v0.0.2/contracts/proxies/PayingProxy.sol)

## Flows

### Safe creation flowchart

<img src="../_static/relay_service/safe_creation.png" style="background: white">

### Transaction execution flowchart

<img src="../_static/relay_service/send_transaction_from_app.png" style="background: white">

## API Endpoints
---
### /safes/ POST
Creates new Safe Creation Transaction with random signature, generated between user and server, so no one knows what’s the private key of the deployer.

**Note:** we don’t use Chain ID to make it easier the testing in different chains https://github.com/Ethereum/EIPs/issues/155
We don’t need the replay protection, because no one knows the private key
Uses payingProxy
Uses fast from our gas station.
First version will only support ETH as gasToken. Therefore the payment will be returned in Wei.

More info about the signature values in appendix F of Ethereum Yellow Paper

#### Request:
```js
{
	"owners": ["<string>"], // Hexadecimal addresses, with check sum with 0x prefix,
	"threshold": "int", // min 1
	"s": "string", // stringified int, base 10,  (0 "< s "< secp256k1n / 2 + 1)
}
```

#### Returns 
> HTTP 201
```js
{
    "signature": {
        "r": "<string>", // stringified int, base 10 (0 "< r "< secp256k1n)
        "s": "<string>", // stringified int, base 10 (0 "< s "< secp256k1n / 2 + 1)
        "v": "<int>" // (27 or 28)
    },
    "tx" : {
        "from": "<string>",
        "value":  "<string>", // stringified int, base 10 (wei) Will always be 0
        "data": "<string>",
        "gas": "<string>", // stringified int, base 10
        "gasPrice": "<string>", // stringified int, base 10 (wei)
        "nonce": 0
    },
    "safe": "<string>" // hex string with checksum
    "payment": "<string>", // stringified int, base 10, it’s what the service gets as refund
}
```

> HTTP 400 not valid values submitted

**Note:** Atomic operation, many values of s are invalid, the server

Clients should verify the server’s response by the following process:
Reconstruct sender address from "signature"
Reconstruct safe address from sender address and nonce = 0
Verify that "safe" checksum and reconstructed safe addresses checksum are the same 
Verify that "signature" is correct for hash of "tx"
Verify that "tx" has valid bytecode [postponed until mainnet release]
If all checks pass, then transaction and safe address are valid and user can transfer at least "payment" amount of ETH to the safe address.
Otherwise, the response has error or it is compromised, and it should not be used any further.

---
### /safes/\<address\>/funded PUT
Signal funds were transferred, start safe creation

#### Returns:
> HTTP 202

**Note:** creation has 2 tx’s and a check, this is done asynchronously through a queue

---
### /safes/\<address\>/funded GET
Get info about safe funded status

#### Returns:
> HTTP 200
```js
{
    "safeFunded": "<boolean>",  # Safe has enough balance to start the deploying
    "deployerFunded":  "<boolean>",  # Deployer was funded and confirmations awaited
    "deployerFundedTxHash": "<string>",  # Deployer funding tx hash
    "safeDeployed": "<boolean>",  # Safe was finally deployed
    "safeDeployedTxHash": "<string>"  # Safe tx was sent to the network
}
```

---
### /gas-station/ GET
Similar to ETH Gas Station but with reliable availability and enough rate limit
#### Returns:
> HTTP 200
```js
{
	"safeLow": "<string>", // stringified int, wei
	"standard": "<string>", // stringified int, wei
	"fast": "<string>", // stringified int, wei
	"fastest": "<string>", // stringified int, wei
}
```

---
### /safes/\<address\>/transactions/estimate/ POST 
Estimates the gas and gasPrice for the requested multisig transaction. Safe contract needs to exist previously. To estimate transaction cost, use the following formula:

> gasCosts = (safeTxGas + dataGas) * gasPrice
#### Request:
```js
{
	"safe": "<address>",
	"to": "<address>",
	"value": "<string>", // stringified int, in wei
	"data": "<string>", // prefixed or unprefixed hex string
	"operation": "<integer>", // enumerated from here (0 - call, 1 - delegateCall, 2 - create)
}
```

#### Returns: 
> HTTP 200
```js
{
	"safeTxGas": "<integer>"
    "dataGas": "<integer>" 
    "gasPrice": "<integer>"
    "gasToken": "<string>" // hexadecimal address, checksumed, address(0) for now
}
```

---
### /safes/\<address>\/transactions/ POST
Allows to send and pay transactions via the Transaction Relay Service. The safe contract the tx is directed to must have enough ETH to pay tx fees and be created through the tx relay service. Safe contract needs to exist previously.

#### Request:
```js
{
    "to": "<address>",
    "value": "<string>", // stringified int, in wei, base 10
    "data": "<string>", // prefixed or unprefixed hex string
    "operation": "<integer>", // enumerated from here
    "signatures": [{ 
        "v": "<integer>",
        "r": "<string>",
        "s": "<string>"
    }, ...], // Sorted lexicographically by owner address
    "safeTxGas": "<string>" // stringified int, base 10
    "dataGas": "<string>" // stringified int, base 10
    "gasPrice": "<string>" // stringified int, base 10
    "nonce": "<string>" // stringified int, base 10
    "gasToken": "<string>" // address
}
```

#### Returns:
> HTTP 201
```js
{
	"transactionHash": "<string>"
}
```

**Note:** Atomic operation
