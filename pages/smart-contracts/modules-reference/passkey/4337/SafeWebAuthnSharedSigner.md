# SafeWebAuthnSharedSigner

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeWebAuthnSharedSigner is SignatureValidator
```

A contract for verifying WebAuthn signatures shared by all Safe accounts. This contract uses
storage from the Safe account itself for full ERC-4337 compatibility.
## Structs info

### Signer

```solidity
struct Signer {
	uint256 x;
	uint256 y;
	P256.Verifiers verifiers;
}
```

Data associated with a WebAuthn signer. It represents the X and Y coordinates of the
signer's public key as well as the P256 verifiers to use. This is stored in account storage
starting at the storage slot {SIGNER_SLOT}.
## Events info

### SafeWebAuthnSharedSignerConfigured

```solidity
event SafeWebAuthnSharedSignerConfigured(bytes32 indexed publicKeyHash, uint256 x, uint256 y, P256.Verifiers verifiers)
```

Emitted when the shared signer is configured for an account.

Note that the configured account is not included in the event data. Since configuration
is done as a `DELEGATECALL`, the contract emitting the event is the configured account. This
is also why the event name is prefixed with `SafeWebAuthnSharedSigner`, in order to avoid
event `topic0` collisions with other contracts (seeing as "configured" is a common term).


Parameters:

| Name          | Type           | Description                                         |
| :------------ | :------------- | :-------------------------------------------------- |
| publicKeyHash | bytes32        | The Keccak-256 hash of the public key coordinates.  |
| x             | uint256        | The x-coordinate of the public key.                 |
| y             | uint256        | The y-coordinate of the public key.                 |
| verifiers     | P256.Verifiers | The P-256 verifiers to use.                         |

## Errors info

### NotDelegateCalled

```solidity
error NotDelegateCalled()
```

An error indicating a `CALL` to a function that should only be `DELEGATECALL`-ed.
## State variables info

### SIGNER_SLOT (0x44b8666e)

```solidity
uint256 immutable SIGNER_SLOT
```

The starting storage slot on the account containing the signer data.
## Modifiers info

### onlyDelegateCall

```solidity
modifier onlyDelegateCall()
```

Validates the call is done via `DELEGATECALL`.
## Functions info

### constructor

```solidity
constructor()
```

Create a new shared WebAuthn signer instance.
### getConfiguration (0xc44b11f7)

```solidity
function getConfiguration(
    address account
) public view returns (SafeWebAuthnSharedSigner.Signer memory signer)
```

Return the signer configuration for the specified account.

The calling account must be a Safe, as the signer data is stored in the Safe's storage
and must be read with the {StorageAccessible} support from the Safe.


Parameters:

| Name    | Type    | Description                             |
| :------ | :------ | :-------------------------------------- |
| account | address | The account to request signer data for. |

### configure (0x0dd9692f)

```solidity
function configure(
    SafeWebAuthnSharedSigner.Signer memory signer
) external onlyDelegateCall
```

Sets the signer configuration for the calling account.

The Safe must call this function with a `DELEGATECALL`, as the signer data is stored in
the Safe account's storage.


Parameters:

| Name   | Type                                   | Description                                         |
| :----- | :------------------------------------- | :-------------------------------------------------- |
| signer | struct SafeWebAuthnSharedSigner.Signer | The new signer data to set for the calling account. |
