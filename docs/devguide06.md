---
id: devguide06
title: Querying and Transferring Stake
sidebar_label: Querying and Transferring Stake
---

The ConditionalTokens contract implements the [ERC1155
multitoken](https://eips.ethereum.org/EIPS/eip-1155) interface. In
addition to a holder address, each token is indexed by an ID in this
standard. In particular, position IDs are used to index conditional
tokens. This is reflected in the balance querying function:

<span style="color:#009cb4">*function* **balanceOf** *(address owner, uint256 positionId)external view returns (uint256)*</span>

To transfer conditional tokens, the following functions may be used, as
per ERC1155:

<span style="color:#009cb4">*function* **safeTransferFrom** *(address from, address to, uint256 positionId, uint256 value, bytes data)
 external*</span>
<span style="color:#009cb4">*function* **safeBatchTransferFrom** *(address from, address to, uint256[] positionIds, uint256[] values, bytes data)
 external*</span>

These transfer functions ignore the <span style="color:#DB3A3D">`data`</span> parameter.

> **Note**
When sending to contract accounts, transfers will be rejected unless the
recipient implements the <span style="color:#DB3A3D">`ERC1155TokenReceiver`</span> interface and returns
the expected magic values. See the [ERC1155
multitoken](https://eips.ethereum.org/EIPS/eip-1155) spec for more
information.

Approving an operator account to transfer conditional tokens on your
behalf may also be done via:

<span style="color:#009cb4">*function* **setApprovalForAll** *(address operator, bool approved)external*</span>

Querying the status of approval can be done with:

<span style="color:#009cb4">*function* **isApprovalForAll** *(address owner, address operator) external view returns (bool)*</span>