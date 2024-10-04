# SafeMock

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeMock
```


## State variables info

### singleton (0xb62654fb)

```solidity
address singleton
```


### owner (0x8da5cb5b)

```solidity
address owner
```


### fallbackHandler (0xeed2f252)

```solidity
address fallbackHandler
```


### modules (0xa8ee49fe)

```solidity
mapping(address => bool) modules
```


## Functions info

### constructor

```solidity
constructor()
```


### setup (0x2d34ba79)

```solidity
function setup(address _fallbackHandler, address _module) public virtual
```


### checkSignatures (0x934f3a11)

```solidity
function checkSignatures(
    bytes32 dataHash,
    bytes memory data,
    bytes memory signature
) public view
```


### execTransactionFromModule (0x468721a7)

```solidity
function execTransactionFromModule(
    address payable to,
    uint256 value,
    bytes calldata data,
    uint8 operation
) external returns (bool success)
```


### execTransactionFromModuleReturnData (0x5229073f)

```solidity
function execTransactionFromModuleReturnData(
    address payable to,
    uint256 value,
    bytes calldata data,
    uint8 operation
) external returns (bool success, bytes memory returnData)
```


### getThreshold (0xe75235b8)

```solidity
function getThreshold() external pure returns (uint256)
```


### fallback

```solidity
fallback() external payable
```


### receive

```solidity
receive() external payable
```

