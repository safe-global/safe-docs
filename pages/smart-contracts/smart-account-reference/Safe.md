# Safe

## Overview

#### License: LGPL-3.0-only

```solidity
contract Safe is Singleton, NativeCurrencyPaymentFallback, ModuleManager, OwnerManager, SignatureDecoder, SecuredTokenTransfer, ISignatureValidatorConstants, FallbackManager, StorageAccessible, GuardManager
```

Author: Stefan George - @Georgi87

Most important concepts:
- Threshold: Number of required confirmations for a Safe transaction.
- Owners: List of addresses that control the Safe. They are the only ones that can add/remove owners, change the threshold and
approve transactions. Managed in `OwnerManager`.
- Transaction Hash: Hash of a transaction is calculated using the EIP-712 typed structured data hashing scheme.
- Nonce: Each transaction should have a different nonce to prevent replay attacks.
- Signature: A valid signature of an owner of the Safe for a transaction hash.
- Guard: Guard is a contract that can execute pre- and post- transaction checks. Managed in `GuardManager`.
- Modules: Modules are contracts that can be used to extend the write functionality of a Safe. Managed in `ModuleManager`.
- Fallback: Fallback handler is a contract that can provide additional read-only functional for Safe. Managed in `FallbackManager`.
Note: This version of the implementation contract doesn't emit events for the sake of gas efficiency and therefore requires a tracing node for indexing/
For the events-based implementation see `SafeL2.sol`.

## Events info

### SafeSetup

```solidity
event SafeSetup(address indexed initiator, address[] owners, uint256 threshold, address initializer, address fallbackHandler)
```


### ApproveHash

```solidity
event ApproveHash(bytes32 indexed approvedHash, address indexed owner)
```


### SignMsg

```solidity
event SignMsg(bytes32 indexed msgHash)
```


### ExecutionFailure

```solidity
event ExecutionFailure(bytes32 indexed txHash, uint256 payment)
```


### ExecutionSuccess

```solidity
event ExecutionSuccess(bytes32 indexed txHash, uint256 payment)
```


## Constants info

### VERSION (0xffa1ad74)

```solidity
string constant VERSION = "1.4.1"
```


## State variables info

### nonce (0xaffed0e0)

```solidity
uint256 nonce
```


### signedMessages (0x5ae6bd37)

```solidity
mapping(bytes32 => uint256) signedMessages
```


### approvedHashes (0x7d832974)

```solidity
mapping(address => mapping(bytes32 => uint256)) approvedHashes
```


## Functions info

### constructor

```solidity
constructor()
```


### setup (0xb63e800d)

```solidity
function setup(
    address[] calldata _owners,
    uint256 _threshold,
    address to,
    bytes calldata data,
    address fallbackHandler,
    address paymentToken,
    uint256 payment,
    address payable paymentReceiver
) external
```

Sets an initial storage of the Safe contract.

This method can only be called once.
If a proxy was created without setting up, anyone can call setup and claim the proxy.


Parameters:

| Name            | Type            | Description                                                 |
| :-------------- | :-------------- | :---------------------------------------------------------- |
| _owners         | address[]       | List of Safe owners.                                        |
| _threshold      | uint256         | Number of required confirmations for a Safe transaction.    |
| to              | address         | Contract address for optional delegate call.                |
| data            | bytes           | Data payload for optional delegate call.                    |
| fallbackHandler | address         | Handler for fallback calls to this contract                 |
| paymentToken    | address         | Token that should be used for the payment (0 is ETH)        |
| payment         | uint256         | Value that should be paid                                   |
| paymentReceiver | address payable | Address that should receive the payment (or 0 if tx.origin) |

### execTransaction (0x6a761202)

```solidity
function execTransaction(
    address to,
    uint256 value,
    bytes calldata data,
    Enum.Operation operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address payable refundReceiver,
    bytes memory signatures
) public payable virtual returns (bool success)
```

Executes a `operation` {0: Call, 1: DelegateCall}} transaction to `to` with `value` (Native Currency)
and pays `gasPrice` * `gasLimit` in `gasToken` token to `refundReceiver`.

The fees are always transferred, even if the user transaction fails.
This method doesn't perform any sanity check of the transaction, such as:
- if the contract at `to` address has code or not
- if the `gasToken` is a contract or not
It is the responsibility of the caller to perform such checks.


Parameters:

| Name           | Type                | Description                                                                                                                                               |
| :------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to             | address             | Destination address of Safe transaction.                                                                                                                  |
| value          | uint256             | Ether value of Safe transaction.                                                                                                                          |
| data           | bytes               | Data payload of Safe transaction.                                                                                                                         |
| operation      | enum Enum.Operation | Operation type of Safe transaction.                                                                                                                       |
| safeTxGas      | uint256             | Gas that should be used for the Safe transaction.                                                                                                         |
| baseGas        | uint256             | Gas costs that are independent of the transaction execution(e.g. base transaction fee, signature check, payment of the refund)                            |
| gasPrice       | uint256             | Gas price that should be used for the payment calculation.                                                                                                |
| gasToken       | address             | Token address (or 0 if ETH) that is used for the payment.                                                                                                 |
| refundReceiver | address payable     | Address of receiver of gas payment (or 0 if tx.origin).                                                                                                   |
| signatures     | bytes               | Signature data that should be verified. Can be packed ECDSA signature ({bytes32 r}{bytes32 s}{uint8 v}), contract signature (EIP-1271) or approved hash.  |


Return values:

| Name    | Type | Description                               |
| :------ | :--- | :---------------------------------------- |
| success | bool | Boolean indicating transaction's success. |

### checkSignatures (0x934f3a11)

```solidity
function checkSignatures(
    bytes32 dataHash,
    bytes memory data,
    bytes memory signatures
) public view
```

Checks whether the signature provided is valid for the provided data and hash. Reverts otherwise.


Parameters:

| Name       | Type    | Description                                                                                                                                              |
| :--------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dataHash   | bytes32 | Hash of the data (could be either a message hash or transaction hash)                                                                                    |
| data       | bytes   | That should be signed (this is passed to an external validator contract)                                                                                 |
| signatures | bytes   | Signature data that should be verified. Can be packed ECDSA signature ({bytes32 r}{bytes32 s}{uint8 v}), contract signature (EIP-1271) or approved hash. |

### checkNSignatures (0x12fb68e0)

```solidity
function checkNSignatures(
    bytes32 dataHash,
    bytes memory data,
    bytes memory signatures,
    uint256 requiredSignatures
) public view
```

Checks whether the signature provided is valid for the provided data and hash. Reverts otherwise.

Since the EIP-1271 does an external call, be mindful of reentrancy attacks.


Parameters:

| Name               | Type    | Description                                                                                                                                               |
| :----------------- | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dataHash           | bytes32 | Hash of the data (could be either a message hash or transaction hash)                                                                                     |
| data               | bytes   | That should be signed (this is passed to an external validator contract)                                                                                  |
| signatures         | bytes   | Signature data that should be verified. Can be packed ECDSA signature ({bytes32 r}{bytes32 s}{uint8 v}), contract signature (EIP-1271) or approved hash.  |
| requiredSignatures | uint256 | Amount of required valid signatures.                                                                                                                      |

### approveHash (0xd4d9bdcd)

```solidity
function approveHash(bytes32 hashToApprove) external
```

Marks hash `hashToApprove` as approved.

This can be used with a pre-approved hash transaction signature.
IMPORTANT: The approved hash stays approved forever. There's no revocation mechanism, so it behaves similarly to ECDSA signatures


Parameters:

| Name          | Type    | Description                                                                     |
| :------------ | :------ | :------------------------------------------------------------------------------ |
| hashToApprove | bytes32 | The hash to mark as approved for signatures that are verified by this contract. |

### getChainId (0x3408e470)

```solidity
function getChainId() public view returns (uint256)
```

Returns the ID of the chain the contract is currently deployed on.


Return values:

| Name | Type    | Description                               |
| :--- | :------ | :---------------------------------------- |
| [0]  | uint256 | The ID of the current chain as a uint256. |

### domainSeparator (0xf698da25)

```solidity
function domainSeparator() public view returns (bytes32)
```

Returns the domain separator for this contract, as defined in the EIP-712 standard.


Return values:

| Name | Type    | Description                        |
| :--- | :------ | :--------------------------------- |
| [0]  | bytes32 | bytes32 The domain separator hash. |

### encodeTransactionData (0xe86637db)

```solidity
function encodeTransactionData(
    address to,
    uint256 value,
    bytes calldata data,
    Enum.Operation operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address refundReceiver,
    uint256 _nonce
) public view returns (bytes memory)
```

Returns the pre-image of the transaction hash (see getTransactionHash).


Parameters:

| Name           | Type                | Description                                                                                                                         |
| :------------- | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------- |
| to             | address             | Destination address.                                                                                                                |
| value          | uint256             | Ether value.                                                                                                                        |
| data           | bytes               | Data payload.                                                                                                                       |
| operation      | enum Enum.Operation | Operation type.                                                                                                                     |
| safeTxGas      | uint256             | Gas that should be used for the safe transaction.                                                                                   |
| baseGas        | uint256             | Gas costs for that are independent of the transaction execution(e.g. base transaction fee, signature check, payment of the refund)  |
| gasPrice       | uint256             | Maximum gas price that should be used for this transaction.                                                                         |
| gasToken       | address             | Token address (or 0 if ETH) that is used for the payment.                                                                           |
| refundReceiver | address             | Address of receiver of gas payment (or 0 if tx.origin).                                                                             |
| _nonce         | uint256             | Transaction nonce.                                                                                                                  |


Return values:

| Name | Type  | Description             |
| :--- | :---- | :---------------------- |
| [0]  | bytes | Transaction hash bytes. |

### getTransactionHash (0xd8d11f78)

```solidity
function getTransactionHash(
    address to,
    uint256 value,
    bytes calldata data,
    Enum.Operation operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address refundReceiver,
    uint256 _nonce
) public view returns (bytes32)
```

Returns transaction hash to be signed by owners.


Parameters:

| Name           | Type                | Description                                                  |
| :------------- | :------------------ | :----------------------------------------------------------- |
| to             | address             | Destination address.                                         |
| value          | uint256             | Ether value.                                                 |
| data           | bytes               | Data payload.                                                |
| operation      | enum Enum.Operation | Operation type.                                              |
| safeTxGas      | uint256             | Fas that should be used for the safe transaction.            |
| baseGas        | uint256             | Gas costs for data used to trigger the safe transaction.     |
| gasPrice       | uint256             | Maximum gas price that should be used for this transaction.  |
| gasToken       | address             | Token address (or 0 if ETH) that is used for the payment.    |
| refundReceiver | address             | Address of receiver of gas payment (or 0 if tx.origin).      |
| _nonce         | uint256             | Transaction nonce.                                           |


Return values:

| Name | Type    | Description       |
| :--- | :------ | :---------------- |
| [0]  | bytes32 | Transaction hash. |
