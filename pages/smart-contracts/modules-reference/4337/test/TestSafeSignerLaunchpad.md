# TestSafeSignerLaunchpad

## Overview

#### License: LGPL-3.0-only

```solidity
contract TestSafeSignerLaunchpad is IAccount, SafeStorage
```

The is intended to be set as a Safe proxy's implementation for ERC-4337 user operation that deploys the account.
## State variables info

### SUPPORTED_ENTRYPOINT (0x137e051e)

```solidity
address immutable SUPPORTED_ENTRYPOINT
```


## Modifiers info

### onlyProxy

```solidity
modifier onlyProxy()
```


### onlySupportedEntryPoint

```solidity
modifier onlySupportedEntryPoint()
```


## Functions info

### constructor

```solidity
constructor(address entryPoint)
```


### receive

```solidity
receive() external payable
```


### preValidationSetup (0x4fff40e1)

```solidity
function preValidationSetup(
    bytes32 initHash,
    address to,
    bytes calldata preInit
) external onlyProxy
```


### getInitHash (0x6cbc5b97)

```solidity
function getInitHash(
    address singleton,
    address signerFactory,
    bytes memory signerData,
    address setupTo,
    bytes memory setupData,
    address fallbackHandler
) public view returns (bytes32 initHash)
```


### getOperationHash (0xc0d13687)

```solidity
function getOperationHash(
    bytes32 userOpHash,
    uint48 validAfter,
    uint48 validUntil
) public view returns (bytes32 operationHash)
```


### validateUserOp (0x19822f7c)

```solidity
function validateUserOp(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash,
    uint256 missingAccountFunds
)
    external
    override
    onlyProxy
    onlySupportedEntryPoint
    returns (uint256 validationData)
```

Validate user's signature and nonce
the entryPoint will make the call to the recipient only if this validation call returns successfully.
signature failure should be reported by returning SIG_VALIDATION_FAILED (1).
This allows making a "simulation call" without a valid signature
Other failures (e.g. nonce mismatch, or invalid signature format) should still revert to signal failure.


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

### initializeThenUserOp (0x1e48143b)

```solidity
function initializeThenUserOp(
    address singleton,
    address signerFactory,
    bytes calldata signerData,
    address setupTo,
    bytes calldata setupData,
    address fallbackHandler,
    bytes memory callData
) external onlySupportedEntryPoint
```


### _initHash (0xc67e2d2a)

```solidity
function _initHash() public view returns (bytes32 value)
```

