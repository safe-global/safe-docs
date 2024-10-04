# ISafe

## Overview

#### License: LGPL-3.0-only

```solidity
interface ISafe
```

Minimal interface of a Safe smart account. This only includes functions that are used by
this project.

security-contact: bounty@safe.global
## Functions info

### setup (0xb63e800d)

```solidity
function setup(
    address[] calldata owners,
    uint256 threshold,
    address to,
    bytes calldata data,
    address fallbackHandler,
    address paymentToken,
    uint256 payment,
    address payable paymentReceiver
) external
```

Sets an initial storage of the Safe contract.

This method can only be called once. If a proxy was created without setting up, anyone
can call setup and claim the proxy.


Parameters:

| Name            | Type            | Description                                                 |
| :-------------- | :-------------- | :---------------------------------------------------------- |
| owners          | address[]       | List of Safe owners.                                        |
| threshold       | uint256         | Number of required confirmations for a Safe transaction.    |
| to              | address         | Contract address for optional delegate call.                |
| data            | bytes           | Data payload for optional delegate call.                    |
| fallbackHandler | address         | Handler for fallback calls to this contract                 |
| paymentToken    | address         | Token that should be used for the payment (0 is ETH)        |
| payment         | uint256         | Value that should be paid                                   |
| paymentReceiver | address payable | Address that should receive the payment (or 0 if tx.origin) |

### getStorageAt (0x5624b25b)

```solidity
function getStorageAt(
    uint256 offset,
    uint256 length
) external view returns (bytes memory)
```

Reads `length` bytes of storage in the currents contract


Parameters:

| Name   | Type    | Description                                                                    |
| :----- | :------ | :----------------------------------------------------------------------------- |
| offset | uint256 | - the offset in the current contract's storage in words to start reading from  |
| length | uint256 | - the number of words (32 bytes) of data to read                               |


Return values:

| Name | Type  | Description               |
| :--- | :---- | :------------------------ |
| [0]  | bytes | the bytes that were read. |
