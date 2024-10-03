# ERC721TokenReceiver

## Overview

#### License: LGPL-3.0-only

```solidity
interface ERC721TokenReceiver
```

Note: the ERC-165 identifier for this interface is 0x150b7a02.
## Functions info

### onERC721Received (0x150b7a02)

```solidity
function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes calldata _data
) external returns (bytes4)
```

Handle the receipt of an NFT

The ERC721 smart contract calls this function on the recipient
after a `transfer`. This function MAY throw to revert and reject the
transfer. Return of other than the magic value MUST result in the
transaction being reverted.
Note: the contract address is always the message sender.


Parameters:

| Name      | Type    | Description                                            |
| :-------- | :------ | :----------------------------------------------------- |
| _operator | address | The address which called `safeTransferFrom` function.  |
| _from     | address | The address which previously owned the token.          |
| _tokenId  | uint256 | The NFT identifier which is being transferred.         |
| _data     | bytes   | Additional data with no specified format.              |


Return values:

| Name | Type   | Description                                                                             |
| :--- | :----- | :-------------------------------------------------------------------------------------- |
| [0]  | bytes4 | `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`. unless throwing |
