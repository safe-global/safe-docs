# SafeMigration

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeMigration is SafeStorage
```

Author: @safe-global/safe-protocol

This is a generic contract that facilitates Safe and SafeL2 proxy contracts to migrate their singleton address.
The supported target Safe version is immutable and set in the constructor during the deployment of the contract.
This contract also supports migration with fallback handler update.

IMPORTANT: The library is intended to be used with the Safe standard proxy that stores the singleton address
at the storage slot 0. Use at your own risk with custom proxy implementations. The contract will allow invocations
to the migration functions only via delegatecall.
## Events info

### ChangedMasterCopy

```solidity
event ChangedMasterCopy(address singleton)
```

Event indicating a change of a singleton address. Named master copy here for legacy reasons.


Parameters:

| Name      | Type    | Description             |
| :-------- | :------ | :---------------------- |
| singleton | address | New master copy address |

## State variables info

### MIGRATION_SINGLETON (0x72f7a956)

```solidity
address immutable MIGRATION_SINGLETON
```

Address of this contract
### SAFE_SINGLETON (0xcaa12add)

```solidity
address immutable SAFE_SINGLETON
```

Address of the Safe Singleton implementation
### SAFE_L2_SINGLETON (0x9bf47d6e)

```solidity
address immutable SAFE_L2_SINGLETON
```

Address of the Safe Singleton (L2) implementation
### SAFE_FALLBACK_HANDLER (0x0d7101f7)

```solidity
address immutable SAFE_FALLBACK_HANDLER
```

Address of the Fallback Handler
## Modifiers info

### onlyDelegateCall

```solidity
modifier onlyDelegateCall()
```

Modifier to make a function callable via delegatecall only.
If the function is called via a regular call, it will revert.
## Functions info

### constructor

```solidity
constructor(
    address safeSingleton,
    address safeL2Singleton,
    address fallbackHandler
)
```

Constructor


Parameters:

| Name            | Type    | Description                                     |
| :-------------- | :------ | :---------------------------------------------- |
| safeSingleton   | address | Address of the Safe Singleton implementation    |
| safeL2Singleton | address | Address of the SafeL2 Singleton implementation  |
| fallbackHandler | address | Address of the fallback handler implementation  |

### migrateSingleton (0xf6682ab0)

```solidity
function migrateSingleton() public onlyDelegateCall
```

Migrate the Safe contract to a new Safe Singleton implementation.
### migrateWithFallbackHandler (0xed007fc6)

```solidity
function migrateWithFallbackHandler() external onlyDelegateCall
```

Migrate to Safe Singleton and set the fallback handler. This function is intended to be used when migrating
a Safe to a version which also requires updating fallback handler.
### migrateL2Singleton (0x07f464a4)

```solidity
function migrateL2Singleton() public onlyDelegateCall
```

Migrate the Safe contract to a new Safe Singleton (L2) implementation.
### migrateL2WithFallbackHandler (0x68cb3d94)

```solidity
function migrateL2WithFallbackHandler() external onlyDelegateCall
```

Migrate to Safe Singleton (L2) and set the fallback handler. This function is intended to be used when migrating
a Safe to a version which also requires updating fallback handler.