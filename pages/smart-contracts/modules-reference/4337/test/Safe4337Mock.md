# Safe4337Mock

## Overview

#### License: LGPL-3.0-only

```solidity
contract Safe4337Mock is SafeMock, IAccount
```


## Structs info

### EncodedSafeOpStruct

```solidity
struct EncodedSafeOpStruct {
	bytes32 typeHash;
	address safe;
	uint256 nonce;
	bytes32 initCodeHash;
	bytes32 callDataHash;
	uint128 verificationGasLimit;
	uint128 callGasLimit;
	uint256 preVerificationGas;
	uint128 maxPriorityFeePerGas;
	uint128 maxFeePerGas;
	bytes32 paymasterAndDataHash;
	uint48 validAfter;
	uint48 validUntil;
	address entryPoint;
}
```

A structure used internally for manually encoding a Safe operation for when computing the EIP-712 struct hash.
## State variables info

### SUPPORTED_ENTRYPOINT (0x137e051e)

```solidity
address immutable SUPPORTED_ENTRYPOINT
```


## Modifiers info

### onlySupportedEntryPoint

```solidity
modifier onlySupportedEntryPoint()
```

Validates the call is initiated by the entry point.
## Functions info

### constructor

```solidity
constructor(address entryPoint)
```


### validateUserOp (0x19822f7c)

```solidity
function validateUserOp(
    PackedUserOperation calldata userOp,
    bytes32,
    uint256 missingAccountFunds
) external onlySupportedEntryPoint returns (uint256 validationData)
```

Validate user's signature and nonce
the entryPoint will make the call to the recipient only if this validation call returns successfully.
signature failure should be reported by returning SIG_VALIDATION_FAILED (1).
This allows making a "simulation call" without a valid signature
Other failures (e.g. nonce mismatch, or invalid signature format) should still revert to signal failure.


Validates user operation provided by the entry point


Parameters:

| Name                | Type                       | Description                                                                                                                                                                                                                                                                                                                                                                                            |
| :------------------ | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| userOp              | struct PackedUserOperation | - The operation that is about to be executed.                                                                                                                                                                                                                                                                                                                                                          |
| userOpHash          | bytes32                    | - Hash of the user's request data. can be used as the basis for signature.                                                                                                                                                                                                                                                                                                                             |
| missingAccountFunds | uint256                    | - Missing funds on the account's deposit in the entrypoint. This is the minimum amount to transfer to the sender(entryPoint) to be able to make the call. The excess is left as a deposit in the entrypoint for future calls. Can be withdrawn anytime using "entryPoint.withdrawTo()". In case there is a paymaster in the request (or the current deposit is high enough), this value will be zero.  |


Return values:

| Name           | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| validationData | uint256 | - Packaged ValidationData structure. use `_packValidationData` and `_unpackValidationData` to encode and decode. <20-byte> sigAuthorizer - 0 for valid signature, 1 to mark signature failure, otherwise, an address of an "authorizer" contract. <6-byte> validUntil - Last timestamp this operation is valid. 0 for "indefinite" <6-byte> validAfter - First timestamp this operation is valid If an account doesn't use time-range, it is enough to return SIG_VALIDATION_FAILED value (1) for signature failure. Note that the validation code cannot use block.timestamp (or block.number) directly.      |

### executeUserOp (0x7bb37428)

```solidity
function executeUserOp(
    address to,
    uint256 value,
    bytes memory data,
    uint8 operation
) external onlySupportedEntryPoint
```

Executes user operation provided by the entry point

Reverts if unsuccessful


Parameters:

| Name      | Type    | Description                                 |
| :-------- | :------ | :------------------------------------------ |
| to        | address | Destination address of the user operation.  |
| value     | uint256 | Ether value of the user operation.          |
| data      | bytes   | Data payload of the user operation.         |
| operation | uint8   | Operation type of the user operation.       |

### executeUserOpWithErrorString (0x541d63c8)

```solidity
function executeUserOpWithErrorString(
    address to,
    uint256 value,
    bytes memory data,
    uint8 operation
) external onlySupportedEntryPoint
```

Executes user operation provided by the entry point

Reverts if unsuccessful and bubbles up the error message


Parameters:

| Name      | Type    | Description                                 |
| :-------- | :------ | :------------------------------------------ |
| to        | address | Destination address of the user operation.  |
| value     | uint256 | Ether value of the user operation.          |
| data      | bytes   | Data payload of the user operation.         |
| operation | uint8   | Operation type of the user operation.       |

### domainSeparator (0xf698da25)

```solidity
function domainSeparator() public view returns (bytes32)
```


### chainId (0x9a8a0592)

```solidity
function chainId() public view returns (uint256)
```


### getOperationHash (0xbbe5dc4f)

```solidity
function getOperationHash(
    PackedUserOperation calldata userOp
) external view returns (bytes32 operationHash)
```

Returns the 32-byte Safe operation hash to be signed by owners for the specified ERC-4337 user operation.

The Safe operation timestamps are pre-pended to the signature bytes as `abi.encodePacked(validAfter, validUntil, signatures)`.


Parameters:

| Name   | Type                       | Description                   |
| :----- | :------------------------- | :---------------------------- |
| userOp | struct PackedUserOperation | The ERC-4337 user operation.  |


Return values:

| Name          | Type    | Description     |
| :------------ | :------ | :-------------- |
| operationHash | bytes32 | Operation hash. |
