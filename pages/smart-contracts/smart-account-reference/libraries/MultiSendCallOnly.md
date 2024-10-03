# MultiSendCallOnly

## Overview

#### License: LGPL-3.0-only

```solidity
contract MultiSendCallOnly
```

Author: Stefan George - @Georgi87

The guard logic is not required here as this contract doesn't support nested delegate calls

## Functions info

### multiSend (0x8d80ff0a)

```solidity
function multiSend(bytes memory transactions) public payable
```

The code is for most part the same as the normal MultiSend (to keep compatibility),
but reverts if a transaction tries to use a delegatecall.

Sends multiple transactions and reverts all if one fails.


Parameters:

| Name         | Type  | Description                                                                                                                                                                                                                                                                                                            |
| :----------- | :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transactions | bytes | Encoded transactions. Each transaction is encoded as a packed bytes of operation has to be uint8(0) in this version (=> 1 byte), to as a address (=> 20 bytes), value as a uint256 (=> 32 bytes), data length as a uint256 (=> 32 bytes), data as bytes. see abi.encodePacked for more information on packed encoding  |
