# SafeToL2Setup

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeToL2Setup is SafeStorage
```

This contract facilitates the deployment of a Safe to the same address on all networks by
automatically changing the singleton to the L2 version when not on chain ID 1.
This contract expects the singleton to be the {Safe} by default. Even if there are more
{SafeL2} proxies deployed, the average gas cost on L2s is significantly lower, making the
current design more economically efficient overall.

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

## Modifiers info

### onlyDelegateCall

```solidity
modifier onlyDelegateCall()
```

Modifier ensure a function is only called via `DELEGATECALL`. Will revert otherwise.
### onlyNonceZero

```solidity
modifier onlyNonceZero()
```

Modifier to prevent using initialized Safes.
### onlyContract

```solidity
modifier onlyContract(address account)
```

Modifier to ensure that the specified account is a contract.
## Functions info

### constructor

```solidity
constructor()
```

Initializes a new {SafeToL2Setup} instance.
### setupToL2 (0xfe51f643)

```solidity
function setupToL2(
    address l2Singleton
) external onlyDelegateCall onlyNonceZero onlyContract(l2Singleton)
```

Setup the Safe with the provided L2 singleton if needed.

This function checks that the chain ID is not 1, and if it isn't updates the singleton
to the provided L2 singleton.