# MultiSend

## Overview

#### License: LGPL-3.0-only

```solidity
contract MultiSend
```

Author: Nick Dodson - <nick.dodson@consensys.net>

## Functions info

### constructor

```solidity
constructor()
```


### multiSend (0x8d80ff0a)

```solidity
function multiSend(bytes memory transactions) public payable
```

This method is payable as delegatecalls keep the msg.value from the previous call
If the calling method (e.g. execTransaction) received ETH this would revert otherwise
Sends multiple transactions and reverts all if one fails.


Parameters:

| Name         | Type  | Description                                                                                                                                                                                                                                                                                                                              |
| :----------- | :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transactions | bytes | Encoded transactions. Each transaction is encoded as a packed bytes of operation as a uint8 with 0 for a call or 1 for a delegatecall (=> 1 byte), to as a address (=> 20 bytes), value as a uint256 (=> 32 bytes), data length as a uint256 (=> 32 bytes), data as bytes. see abi.encodePacked for more information on packed encoding  |
