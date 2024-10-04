# ISafeTest

## Overview

#### License: LGPL-3.0-only

```solidity
interface ISafeTest
```


## Functions info

### getThreshold (0xe75235b8)

```solidity
function getThreshold() external view returns (uint256)
```


### getChainId (0x3408e470)

```solidity
function getChainId() external view returns (uint256)
```


### isOwner (0x2f54bf6e)

```solidity
function isOwner(address owner) external view returns (bool)
```


### isModuleEnabled (0x2d9ad53d)

```solidity
function isModuleEnabled(address module) external view returns (bool)
```


### execTransaction (0x6a761202)

```solidity
function execTransaction(
    address to,
    uint256 value,
    bytes calldata data,
    uint8 operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address payable refundReceiver,
    bytes memory signatures
) external payable returns (bool success)
```


### addOwnerWithThreshold (0x0d582f13)

```solidity
function addOwnerWithThreshold(address owner, uint256 _threshold) external
```


### enableModule (0x610b5925)

```solidity
function enableModule(address module) external
```


### nonce (0xaffed0e0)

```solidity
function nonce() external view returns (uint256)
```

