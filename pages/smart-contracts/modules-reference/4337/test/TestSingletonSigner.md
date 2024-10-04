# TestSingletonSigner

## Overview

#### License: LGPL-3.0-only

```solidity
contract TestSingletonSigner is ISignatureValidator
```


## Structs info

### Key

```solidity
struct Key {
	uint256 _dummy;
	uint256 value;
}
```


## State variables info

### keys (0x670d14b2)

```solidity
mapping(address => struct TestSingletonSigner.Key) keys
```


## Functions info

### setKey (0xd6528776)

```solidity
function setKey(uint256 key) external
```


### isValidSignature (0x20c13b0b)

```solidity
function isValidSignature(
    bytes memory data,
    bytes memory signatureData
) public view virtual override returns (bytes4 magicValue)
```

