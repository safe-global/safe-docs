# ERC1155Token

## Overview

#### License: LGPL-3.0-only

```solidity
contract ERC1155Token
```


## Functions info

### balanceOf (0x00fdd58e)

```solidity
function balanceOf(address owner, uint256 id) public view returns (uint256)
```

Get the specified address' balance for token with specified ID.


Parameters:

| Name  | Type    | Description                      |
| :---- | :------ | :------------------------------- |
| owner | address | The address of the token holder  |
| id    | uint256 | ID of the token                  |


Return values:

| Name | Type    | Description                                     |
| :--- | :------ | :---------------------------------------------- |
| [0]  | uint256 | The owner's balance of the token type requested |

### safeTransferFrom (0xf242432a)

```solidity
function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 value,
    bytes calldata data
) external
```

Transfers `value` amount of an `id` from the `from` address to the `to` address specified.
Caller must be approved to manage the tokens being transferred out of the `from` account.
If `to` is a smart contract, will call `onERC1155Received` on `to` and act appropriately.


Parameters:

| Name  | Type    | Description                                                          |
| :---- | :------ | :------------------------------------------------------------------- |
| from  | address | Source address                                                       |
| to    | address | Target address                                                       |
| id    | uint256 | ID of the token type                                                 |
| value | uint256 | Transfer amount                                                      |
| data  | bytes   | Data forwarded to `onERC1155Received` if `to` is a contract receiver |

### mint (0x731133e9)

```solidity
function mint(
    address to,
    uint256 id,
    uint256 value,
    bytes calldata data
) external
```

Test function to mint an amount of a token with the given ID


Parameters:

| Name  | Type    | Description                                                          |
| :---- | :------ | :------------------------------------------------------------------- |
| to    | address | The address that will own the minted token                           |
| id    | uint256 | ID of the token to be minted                                         |
| value | uint256 | Amount of the token to be minted                                     |
| data  | bytes   | Data forwarded to `onERC1155Received` if `to` is a contract receiver |
