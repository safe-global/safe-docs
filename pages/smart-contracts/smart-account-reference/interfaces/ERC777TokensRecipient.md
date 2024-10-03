# ERC777TokensRecipient

## Overview

#### License: LGPL-3.0-only

```solidity
interface ERC777TokensRecipient
```

Interface for contracts that will be called with the ERC777 token's `tokensReceived` method.
The contract receiving the tokens must implement this interface in order to receive the tokens.
## Functions info

### tokensReceived (0x0023de29)

```solidity
function tokensReceived(
    address operator,
    address from,
    address to,
    uint256 amount,
    bytes calldata data,
    bytes calldata operatorData
) external
```

Called by the ERC777 token contract after a successful transfer or a minting operation.


Parameters:

| Name         | Type    | Description                                                                               |
| :----------- | :------ | :---------------------------------------------------------------------------------------- |
| operator     | address | The address of the operator performing the transfer or minting operation.                 |
| from         | address | The address of the sender.                                                                |
| to           | address | The address of the recipient.                                                             |
| amount       | uint256 | The amount of tokens that were transferred or minted.                                     |
| data         | bytes   | Additional data that was passed during the transfer or minting operation.                 |
| operatorData | bytes   | Additional data that was passed by the operator during the transfer or minting operation. |
