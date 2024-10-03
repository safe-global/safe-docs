# SignMessageLib

## Overview

#### License: LGPL-3.0-only

```solidity
contract SignMessageLib is SafeStorage
```

Author: Richard Meissner - @rmeissner
## Events info

### SignMsg

```solidity
event SignMsg(bytes32 indexed msgHash)
```


## Functions info

### signMessage (0x85a5affe)

```solidity
function signMessage(bytes calldata _data) external
```

Marks a message (`_data`) as signed.

Can be verified using EIP-1271 validation method by passing the pre-image of the message hash and empty bytes as the signature.


Parameters:

| Name  | Type  | Description                                                                           |
| :---- | :---- | :------------------------------------------------------------------------------------ |
| _data | bytes | Arbitrary length data that should be marked as signed on the behalf of address(this). |

### getMessageHash (0x0a1028c4)

```solidity
function getMessageHash(bytes memory message) public view returns (bytes32)
```

Returns hash of a message that can be signed by owners.


Parameters:

| Name    | Type  | Description                     |
| :------ | :---- | :------------------------------ |
| message | bytes | Message that should be hashed.  |


Return values:

| Name | Type    | Description   |
| :--- | :------ | :------------ |
| [0]  | bytes32 | Message hash. |
