# ISafe

## Overview

#### License: LGPL-3.0-only

```solidity
interface ISafe is IModuleManager, IOwnerManager, IFallbackManager
```

Author: @safe-global/safe-protocol
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


## Functions info

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
) external payable returns (bool success)
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

### checkSignatures (0xed516d51)

```solidity
function checkSignatures(
    bytes32 dataHash,
    bytes memory signatures
) external view
```

Checks whether the signature provided is valid for the provided data and hash. Reverts otherwise.


Parameters:

| Name       | Type    | Description                                                                                                                                              |
| :--------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dataHash   | bytes32 | Hash of the data (could be either a message hash or transaction hash)                                                                                    |
| signatures | bytes   | Signature data that should be verified. Can be packed ECDSA signature ({bytes32 r}{bytes32 s}{uint8 v}), contract signature (EIP-1271) or approved hash. |

### checkNSignatures (0x1fcac7f3)

```solidity
function checkNSignatures(
    address executor,
    bytes32 dataHash,
    bytes memory signatures,
    uint256 requiredSignatures
) external view
```

Checks whether the signature provided is valid for the provided data and hash. Reverts otherwise.

Since the EIP-1271 does an external call, be mindful of reentrancy attacks.


Parameters:

| Name               | Type    | Description                                                                                                                                                                                    |
| :----------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| executor           | address | Address that executing the transaction. ⚠️⚠️⚠️ Make sure that the executor address is a legitmate executor. Incorrectly passed the executor might reduce the threshold by 1 signature. ⚠️⚠️⚠️  |
| dataHash           | bytes32 | Hash of the data (could be either a message hash or transaction hash)                                                                                                                          |
| signatures         | bytes   | Signature data that should be verified. Can be packed ECDSA signature ({bytes32 r}{bytes32 s}{uint8 v}), contract signature (EIP-1271) or approved hash.                                       |
| requiredSignatures | uint256 | Amount of required valid signatures.                                                                                                                                                           |

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

### domainSeparator (0xf698da25)

```solidity
function domainSeparator() external view returns (bytes32)
```

Returns the domain separator for this contract, as defined in the EIP-712 standard.


Return values:

| Name | Type    | Description                        |
| :--- | :------ | :--------------------------------- |
| [0]  | bytes32 | bytes32 The domain separator hash. |

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
) external view returns (bytes32)
```

Returns transaction hash to be signed by owners.


Parameters:

| Name           | Type                | Description                                                  |
| :------------- | :------------------ | :----------------------------------------------------------- |
| to             | address             | Destination address.                                         |
| value          | uint256             | Ether value.                                                 |
| data           | bytes               | Data payload.                                                |
| operation      | enum Enum.Operation | Operation type.                                              |
| safeTxGas      | uint256             | Gas that should be used for the safe transaction.            |
| baseGas        | uint256             | Gas costs for data used to trigger the safe transaction.     |
| gasPrice       | uint256             | Maximum gas price that should be used for this transaction.  |
| gasToken       | address             | Token address (or 0 if ETH) that is used for the payment.    |
| refundReceiver | address             | Address of receiver of gas payment (or 0 if tx.origin).      |
| _nonce         | uint256             | Transaction nonce.                                           |


Return values:

| Name | Type    | Description       |
| :--- | :------ | :---------------- |
| [0]  | bytes32 | Transaction hash. |

### VERSION (0xffa1ad74)

```solidity
function VERSION() external view returns (string memory)
```

Returns the version of the Safe contract.


Return values:

| Name | Type   | Description     |
| :--- | :----- | :-------------- |
| [0]  | string | Version string. |

### nonce (0xaffed0e0)

```solidity
function nonce() external view returns (uint256)
```

Returns the nonce of the Safe contract.


Return values:

| Name | Type    | Description |
| :--- | :------ | :---------- |
| [0]  | uint256 | Nonce.      |

### signedMessages (0x5ae6bd37)

```solidity
function signedMessages(bytes32 messageHash) external view returns (uint256)
```

Returns a uint if the messageHash is signed by the owner.


Parameters:

| Name        | Type    | Description                              |
| :---------- | :------ | :--------------------------------------- |
| messageHash | bytes32 | Hash of message that should be checked.  |


Return values:

| Name | Type    | Description                                  |
| :--- | :------ | :------------------------------------------- |
| [0]  | uint256 | Number denoting if an owner signed the hash. |

### approvedHashes (0x7d832974)

```solidity
function approvedHashes(
    address owner,
    bytes32 messageHash
) external view returns (uint256)
```

Returns a uint if the messageHash is approved by the owner.


Parameters:

| Name        | Type    | Description                              |
| :---------- | :------ | :--------------------------------------- |
| owner       | address | Owner address that should be checked.    |
| messageHash | bytes32 | Hash of message that should be checked.  |


Return values:

| Name | Type    | Description                                    |
| :--- | :------ | :--------------------------------------------- |
| [0]  | uint256 | Number denoting if an owner approved the hash. |
