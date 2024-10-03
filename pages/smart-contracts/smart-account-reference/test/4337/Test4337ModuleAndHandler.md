# Test4337ModuleAndHandler

## Overview

#### License: LGPL-3.0-only

```solidity
contract Test4337ModuleAndHandler is SafeStorage
```

A Dummy 4337 Module/Handler for testing purposes
⚠️ ⚠️ ⚠️ DO NOT USE IN PRODUCTION ⚠️ ⚠️ ⚠️
The module does not perform ANY validation, it just executes validateUserOp and execTransaction
to perform the opcode level compliance by the bundler.
## State variables info

### myAddress (0x26b85ee1)

```solidity
address immutable myAddress
```


### entryPoint (0xb0d691fe)

```solidity
address immutable entryPoint
```


## Functions info

### constructor

```solidity
constructor(address entryPointAddress)
```


### validateUserOp (0x3a871cdd)

```solidity
function validateUserOp(
    UserOperation calldata userOp,
    bytes32,
    uint256 missingAccountFunds
) external returns (uint256 validationData)
```


### execTransaction (0xab4ed83e)

```solidity
function execTransaction(
    address to,
    uint256 value,
    bytes calldata data
) external payable
```


### enableMyself (0xa798b2b1)

```solidity
function enableMyself() public
```

