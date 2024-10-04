# TestSingletonSignerFactory

## Overview

#### License: LGPL-3.0-only

```solidity
contract TestSingletonSignerFactory
```


## Constants info

### SIGNER_CODE_HASH (0xcc660c2b)

```solidity
bytes32 constant SIGNER_CODE_HASH = keccak256(type(TestSingletonSigner).creationCode)
```


## Functions info

### getSigner (0x3ffefe4e)

```solidity
function getSigner(uint256 index) public view returns (address)
```


### deploySigner (0xff7a787d)

```solidity
function deploySigner(uint256 index) external
```

