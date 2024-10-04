# TestUniqueSigner

## Overview

#### License: LGPL-3.0-only

```solidity
contract TestUniqueSigner is ISignatureValidator
```


## State variables info

### KEY (0x2dc387b3)

```solidity
uint256 immutable KEY
```


## Functions info

### constructor

```solidity
constructor(uint256 key)
```


### isValidSignature (0x20c13b0b)

```solidity
function isValidSignature(
    bytes memory data,
    bytes memory signatureData
) public view virtual override returns (bytes4 magicValue)
```

