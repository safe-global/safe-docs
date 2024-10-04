# InitCode

## Overview

#### License: LGPL-3.0-only

```solidity
contract InitCode
```


## Structs info

### Config

```solidity
struct Config {
	address safeModuleSetup;
	address erc4337module;
	address safeSingleton;
	address proxyFactory;
}
```


## State variables info

### SAFE_MODULE_SETUP_ADDRESS (0x200dc20b)

```solidity
address immutable SAFE_MODULE_SETUP_ADDRESS
```


### SAFE_4337_MODULE_ADDRESS (0xae6809cf)

```solidity
address immutable SAFE_4337_MODULE_ADDRESS
```


### SAFE_SINGLETON_ADDRESS (0x915dd272)

```solidity
address immutable SAFE_SINGLETON_ADDRESS
```


### SAFE_PROXY_FACTORY_ADDRESS (0x2bfff14b)

```solidity
address immutable SAFE_PROXY_FACTORY_ADDRESS
```


## Functions info

### constructor

```solidity
constructor(InitCode.Config memory config)
```


### getInitCode (0x3d80245f)

```solidity
function getInitCode(
    address[] memory owners,
    uint256 threshold,
    uint256 saltNonce
) external view returns (bytes memory)
```

CHANGES TO THIS FUNCTION SHOULD BE MIRRORED IN THE README!
Compute ERC-4337 initCode for a new Safe with the Safe4337Module.
