# TokenCallbackHandler

## Overview

#### License: LGPL-3.0-only

```solidity
contract TokenCallbackHandler is ERC1155TokenReceiver, ERC777TokensRecipient, ERC721TokenReceiver, IERC165
```

Author: Richard Meissner - @rmeissner
## Functions info

### onERC1155Received (0xf23a6e61)

```solidity
function onERC1155Received(
    address,
    address,
    uint256,
    uint256,
    bytes calldata
) external pure override returns (bytes4)
```

Handles ERC1155 Token callback.
return Standardized onERC1155Received return value.
### onERC1155BatchReceived (0xbc197c81)

```solidity
function onERC1155BatchReceived(
    address,
    address,
    uint256[] calldata,
    uint256[] calldata,
    bytes calldata
) external pure override returns (bytes4)
```

Handles ERC1155 Token batch callback.
return Standardized onERC1155BatchReceived return value.
### onERC721Received (0x150b7a02)

```solidity
function onERC721Received(
    address,
    address,
    uint256,
    bytes calldata
) external pure override returns (bytes4)
```

Handles ERC721 Token callback.
return Standardized onERC721Received return value.
### tokensReceived (0x0023de29)

```solidity
function tokensReceived(
    address,
    address,
    address,
    uint256,
    bytes calldata,
    bytes calldata
) external pure override
```

Handles ERC777 Token callback.
return nothing (not standardized)
### supportsInterface (0x01ffc9a7)

```solidity
function supportsInterface(
    bytes4 interfaceId
) external view virtual override returns (bool)
```

Implements ERC165 interface support for ERC1155TokenReceiver, ERC721TokenReceiver and IERC165.


Parameters:

| Name        | Type   | Description           |
| :---------- | :----- | :-------------------- |
| interfaceId | bytes4 | Id of the interface.  |


Return values:

| Name | Type | Description                    |
| :--- | :--- | :----------------------------- |
| [0]  | bool | if the interface is supported. |
