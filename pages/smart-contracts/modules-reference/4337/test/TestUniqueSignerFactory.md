# TestUniqueSignerFactory

## Overview

#### License: LGPL-3.0-only

```solidity
contract TestUniqueSignerFactory is IUniqueSignerFactory
```


## Functions info

### getSigner (0xe6adabfd)

```solidity
function getSigner(bytes calldata data) public view returns (address signer)
```

Gets the unique signer address for the specified data.

The unique signer address must be unique for some given data. The signer is not guaranteed to be created yet.


Parameters:

| Name | Type  | Description                |
| :--- | :---- | :------------------------- |
| data | bytes | The signer specific data.  |


Return values:

| Name   | Type    | Description         |
| :----- | :------ | :------------------ |
| signer | address | The signer address. |

### createSigner (0xd312e182)

```solidity
function createSigner(bytes calldata data) external returns (address signer)
```

Create a new unique signer for the specified data.

The unique signer address must be unique for some given data. This must not revert if the unique owner already exists.


Parameters:

| Name | Type  | Description                |
| :--- | :---- | :------------------------- |
| data | bytes | The signer specific data.  |


Return values:

| Name   | Type    | Description         |
| :----- | :------ | :------------------ |
| signer | address | The signer address. |

### isValidSignatureForSigner (0x930bbb3b)

```solidity
function isValidSignatureForSigner(
    bytes32 message,
    bytes calldata signatureData,
    bytes calldata signerData
) external pure override returns (bytes4 magicValue)
```

