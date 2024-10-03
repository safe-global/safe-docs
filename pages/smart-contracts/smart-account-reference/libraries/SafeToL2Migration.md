# SafeToL2Migration

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeToL2Migration is SafeStorage
```

This contract facilitates the migration of a Safe contract from version 1.1.1 to 1.3.0/1.4.1 L2, 1.3.0 to 1.3.0L2 or from 1.4.1 to 1.4.1L2
Other versions are not supported

IMPORTANT: The migration will only work with proxies that store the implementation address in the storage slot 0.
## Events info

### ChangedMasterCopy

```solidity
event ChangedMasterCopy(address singleton)
```

Event indicating a change of master copy address.


Parameters:

| Name      | Type    | Description             |
| :-------- | :------ | :---------------------- |
| singleton | address | New master copy address |

### SafeSetup

```solidity
event SafeSetup(address indexed initiator, address[] owners, uint256 threshold, address initializer, address fallbackHandler)
```


### SafeMultiSigTransaction

```solidity
event SafeMultiSigTransaction(address to, uint256 value, bytes data, Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address payable refundReceiver, bytes signatures, bytes additionalInfo)
```


## State variables info

### MIGRATION_SINGLETON (0x72f7a956)

```solidity
address immutable MIGRATION_SINGLETON
```


## Modifiers info

### onlyDelegateCall

```solidity
modifier onlyDelegateCall()
```

Modifier to make a function callable via delegatecall only.
If the function is called via a regular call, it will revert.
### onlyNonceZero

```solidity
modifier onlyNonceZero()
```

Modifier to prevent using initialized Safes.
If Safe has a nonce higher than 0, it will revert
## Functions info

### constructor

```solidity
constructor()
```

Constructor

Initializes the migrationSingleton with the contract's own address.
### migrateToL2 (0xef2624ae)

```solidity
function migrateToL2(
    address l2Singleton
) external onlyDelegateCall onlyNonceZero
```

Migrate from Safe 1.3.0/1.4.1 Singleton (L1) to the same version provided L2 singleton
Safe is required to have nonce 0 so backend can support it after the migration

This function should only be called via a delegatecall to perform the upgrade.
Singletons versions will be compared, so it implies that contracts exist
### migrateFromV111 (0xd9a20812)

```solidity
function migrateFromV111(
    address l2Singleton,
    address fallbackHandler
) external onlyDelegateCall onlyNonceZero
```

Migrate from Safe 1.1.1 Singleton to 1.3.0 or 1.4.1 L2
Safe is required to have nonce 0 so backend can support it after the migration

This function should only be called via a delegatecall to perform the upgrade.
Singletons version will be checked, so it implies that contracts exist.
A valid and compatible fallbackHandler needs to be provided, only existence will be checked.