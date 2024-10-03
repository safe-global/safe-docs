# Migration

## Overview

#### License: LGPL-3.0-only

```solidity
contract Migration is SafeStorage
```

Author: Richard Meissner - @rmeissner
## Events info

### ChangedMasterCopy

```solidity
event ChangedMasterCopy(address singleton)
```


## State variables info

### migrationSingleton (0x2e773185)

```solidity
address immutable migrationSingleton
```


### safe120Singleton (0x89f54308)

```solidity
address immutable safe120Singleton
```


## Functions info

### constructor

```solidity
constructor(address targetSingleton)
```


### migrate (0x8fd3ab80)

```solidity
function migrate() public
```

Migrates the Safe to the Singleton contract at `migrationSingleton`.

This can only be called via a delegatecall.