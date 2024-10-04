# Safe4337Module

## Overview

#### License: LGPL-3.0-only

```solidity
contract Safe4337Module is IAccount, HandlerContext, CompatibilityFallbackHandler
```

The contract is both a module and fallback handler.
Safe forwards the `validateUserOp` call to this contract, it validates the user operation and returns the result.
It also executes a module transaction to pay the prefund. Similar flow for the actual operation execution.
Security considerations:
- The module is limited to the entry point address specified in the constructor.
- The user operation hash is signed by the Safe owner(s) and validated by the module.
- The user operation is not allowed to execute any other function than `executeUserOp` and `executeUserOpWithErrorString`.
- Replay protection is handled by the entry point.

security-contact: bounty@safe.global
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
## Errors info

### InvalidEntryPoint

```solidity
error InvalidEntryPoint()
```

An error indicating that the entry point used when deploying a new module instance is invalid.
### InvalidCaller

```solidity
error InvalidCaller()
```

An error indicating that the caller does not match the Safe in the corresponding user operation.

This indicates that the module is being used to validate a user operation for a Safe that did not directly
call this module.
### UnsupportedEntryPoint

```solidity
error UnsupportedEntryPoint()
```

An error indicating that the call validating or executing a user operation was not called by the
supported entry point contract.
### UnsupportedExecutionFunction

```solidity
error UnsupportedExecutionFunction(bytes4 selector)
```

An error indicating that the user operation `callData` does not correspond to one of the two supported
execution functions: `executeUserOp` or `executeUserOpWithErrorString`.
### ExecutionFailed

```solidity
error ExecutionFailed()
```

An error indicating that the user operation failed to execute successfully.

The contract reverts with this error when `executeUserOp` is used instead of bubbling up the original revert
data. When bubbling up revert data is desirable, `executeUserOpWithErrorString` should be used instead.
## State variables info

### SUPPORTED_ENTRYPOINT (0x137e051e)

```solidity
address immutable SUPPORTED_ENTRYPOINT
```

The address of the EntryPoint contract supported by this module.
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

Validates a user operation provided by the entry point.

Must validate caller is the entryPoint.
Must validate the signature and nonce


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

Executes a user operation provided by the entry point.


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

Executes a user operation provided by the entry point and returns error message on failure.


Parameters:

| Name      | Type    | Description                                 |
| :-------- | :------ | :------------------------------------------ |
| to        | address | Destination address of the user operation.  |
| value     | uint256 | Ether value of the user operation.          |
| data      | bytes   | Data payload of the user operation.         |
| operation | uint8   | Operation type of the user operation.       |

### domainSeparator (0xf698da25)

```solidity
function domainSeparator() public view returns (bytes32 domainSeparatorHash)
```

Computes the 32-byte domain separator used in EIP-712 signature verification for Safe operations.


Return values:

| Name                | Type    | Description                                          |
| :------------------ | :------ | :--------------------------------------------------- |
| domainSeparatorHash | bytes32 | The EIP-712 domain separator hash for this contract. |

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
