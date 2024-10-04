# AllowanceModule

## Overview

#### License: LGPL-3.0-only

```solidity
contract AllowanceModule is SignatureDecoder
```


## Structs info

### Delegate

```solidity
struct Delegate {
	address delegate;
	uint48 prev;
	uint48 next;
}
```


### Allowance

```solidity
struct Allowance {
	uint96 amount;
	uint96 spent;
	uint16 resetTimeMin;
	uint32 lastResetMin;
	uint16 nonce;
}
```


## Events info

### AddDelegate

```solidity
event AddDelegate(address indexed safe, address delegate)
```


### RemoveDelegate

```solidity
event RemoveDelegate(address indexed safe, address delegate)
```


### ExecuteAllowanceTransfer

```solidity
event ExecuteAllowanceTransfer(address indexed safe, address delegate, address token, address to, uint96 value, uint16 nonce)
```


### PayAllowanceTransfer

```solidity
event PayAllowanceTransfer(address indexed safe, address delegate, address paymentToken, address paymentReceiver, uint96 payment)
```


### SetAllowance

```solidity
event SetAllowance(address indexed safe, address delegate, address token, uint96 allowanceAmount, uint16 resetTime)
```


### ResetAllowance

```solidity
event ResetAllowance(address indexed safe, address delegate, address token)
```


### DeleteAllowance

```solidity
event DeleteAllowance(address indexed safe, address delegate, address token)
```


## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "Allowance Module"
```


### VERSION (0xffa1ad74)

```solidity
string constant VERSION = "0.1.1"
```


### DOMAIN_SEPARATOR_TYPEHASH (0x1db61b54)

```solidity
bytes32 constant DOMAIN_SEPARATOR_TYPEHASH = 0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218
```


### ALLOWANCE_TRANSFER_TYPEHASH (0x43abf5fe)

```solidity
bytes32 constant ALLOWANCE_TRANSFER_TYPEHASH = 0x97c7ed08d51f4a077f71428543a8a2454799e5f6df78c03ef278be094511eda4
```


## State variables info

### allowances (0xb713c9d4)

```solidity
mapping(address => mapping(address => mapping(address => struct AllowanceModule.Allowance))) allowances
```


### tokens (0xf56e81fa)

```solidity
mapping(address => mapping(address => address[])) tokens
```


### delegatesStart (0x310a3bb1)

```solidity
mapping(address => uint48) delegatesStart
```


### delegates (0xce60c692)

```solidity
mapping(address => mapping(uint48 => struct AllowanceModule.Delegate)) delegates
```


## Functions info

### setAllowance (0xbeaeb388)

```solidity
function setAllowance(
    address delegate,
    address token,
    uint96 allowanceAmount,
    uint16 resetTimeMin,
    uint32 resetBaseMin
) public
```

Allows to update the allowance for a specified token. This can only be done via a Safe transaction.


Parameters:

| Name            | Type    | Description                                            |
| :-------------- | :------ | :----------------------------------------------------- |
| delegate        | address | Delegate whose allowance should be updated.            |
| token           | address | Token contract address.                                |
| allowanceAmount | uint96  | allowance in smallest token unit.                      |
| resetTimeMin    | uint16  | Time after which the allowance should reset            |
| resetBaseMin    | uint32  | Time based on which the reset time should be increased |

### resetAllowance (0xc19bf50e)

```solidity
function resetAllowance(address delegate, address token) public
```

Allows to reset the allowance for a specific delegate and token.


Parameters:

| Name     | Type    | Description                                  |
| :------- | :------ | :------------------------------------------- |
| delegate | address | Delegate whose allowance should be updated.  |
| token    | address | Token contract address.                      |

### deleteAllowance (0x885133e3)

```solidity
function deleteAllowance(address delegate, address token) public
```

Allows to remove the allowance for a specific delegate and token. This will set all values except the `nonce` to 0.


Parameters:

| Name     | Type    | Description                                  |
| :------- | :------ | :------------------------------------------- |
| delegate | address | Delegate whose allowance should be updated.  |
| token    | address | Token contract address.                      |

### executeAllowanceTransfer (0x4515641a)

```solidity
function executeAllowanceTransfer(
    ISafe safe,
    address token,
    address payable to,
    uint96 amount,
    address paymentToken,
    uint96 payment,
    address delegate,
    bytes memory signature
) public
```

Allows to use the allowance to perform a transfer.


Parameters:

| Name         | Type            | Description                                                          |
| :----------- | :-------------- | :------------------------------------------------------------------- |
| safe         | contract ISafe  | The Safe whose funds should be used.                                 |
| token        | address         | Token contract address.                                              |
| to           | address payable | Address that should receive the tokens.                              |
| amount       | uint96          | Amount that should be transferred.                                   |
| paymentToken | address         | Token that should be used to pay for the execution of the transfer.  |
| payment      | uint96          | Amount to should be paid for executing the transfer.                 |
| delegate     | address         | Delegate whose allowance should be updated.                          |
| signature    | bytes           | Signature generated by the delegate to authorize the transfer.       |

### getChainId (0x3408e470)

```solidity
function getChainId() public pure returns (uint256)
```

Returns the chain id used by this contract.
### generateTransferHash (0xd626e043)

```solidity
function generateTransferHash(
    address safe,
    address token,
    address to,
    uint96 amount,
    address paymentToken,
    uint96 payment,
    uint16 nonce
) public view returns (bytes32)
```

Generates the transfer hash that should be signed to authorize a transfer
### getTokens (0x8d0e8e1d)

```solidity
function getTokens(
    address safe,
    address delegate
) public view returns (address[] memory)
```


### getTokenAllowance (0x94b31fbd)

```solidity
function getTokenAllowance(
    address safe,
    address delegate,
    address token
) public view returns (uint256[5] memory)
```


### addDelegate (0xe71bdf41)

```solidity
function addDelegate(address delegate) public
```

Allows to add a delegate.


Parameters:

| Name     | Type    | Description                    |
| :------- | :------ | :----------------------------- |
| delegate | address | Delegate that should be added. |

### removeDelegate (0xdd43a79f)

```solidity
function removeDelegate(address delegate, bool removeAllowances) public
```

Allows to remove a delegate.


Parameters:

| Name             | Type    | Description                                                                                                                                                                                    |
| :--------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delegate         | address | Delegate that should be removed.                                                                                                                                                               |
| removeAllowances | bool    | Indicator if allowances should also be removed. This should be set to `true` unless this causes an out of gas, in this case the allowances should be "manually" deleted via `deleteAllowance`. |

### getDelegates (0xeb37abe0)

```solidity
function getDelegates(
    address safe,
    uint48 start,
    uint8 pageSize
) public view returns (address[] memory results, uint48 next)
```

