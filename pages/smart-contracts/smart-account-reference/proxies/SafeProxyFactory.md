# SafeProxyFactory

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeProxyFactory
```

Author: Stefan George - @Georgi87
## Events info

### ProxyCreation

```solidity
event ProxyCreation(SafeProxy indexed proxy, address singleton)
```


## Functions info

### proxyCreationCode (0x53e5d935)

```solidity
function proxyCreationCode() public pure returns (bytes memory)
```

Allows to retrieve the creation code used for the Proxy deployment. With this it is easily possible to calculate predicted address.
### createProxyWithNonce (0x1688f0b9)

```solidity
function createProxyWithNonce(
    address _singleton,
    bytes memory initializer,
    uint256 saltNonce
) public returns (SafeProxy proxy)
```

Deploys a new proxy with `_singleton` singleton and `saltNonce` salt. Optionally executes an initializer call to a new proxy.


Parameters:

| Name        | Type    | Description                                                                                      |
| :---------- | :------ | :----------------------------------------------------------------------------------------------- |
| _singleton  | address | Address of singleton contract. Must be deployed at the time of execution.                        |
| initializer | bytes   | Payload for a message call to be sent to a new proxy contract.                                   |
| saltNonce   | uint256 | Nonce that will be used to generate the salt to calculate the address of the new proxy contract. |

### createChainSpecificProxyWithNonce (0xec9e80bb)

```solidity
function createChainSpecificProxyWithNonce(
    address _singleton,
    bytes memory initializer,
    uint256 saltNonce
) public returns (SafeProxy proxy)
```

Deploys a new chain-specific proxy with `_singleton` singleton and `saltNonce` salt. Optionally executes an initializer call to a new proxy.

Allows to create a new proxy contract that should exist only on 1 network (e.g. specific governance or admin accounts)
by including the chain id in the create2 salt. Such proxies cannot be created on other networks by replaying the transaction.


Parameters:

| Name        | Type    | Description                                                                                      |
| :---------- | :------ | :----------------------------------------------------------------------------------------------- |
| _singleton  | address | Address of singleton contract. Must be deployed at the time of execution.                        |
| initializer | bytes   | Payload for a message call to be sent to a new proxy contract.                                   |
| saltNonce   | uint256 | Nonce that will be used to generate the salt to calculate the address of the new proxy contract. |

### createProxyWithCallback (0xd18af54d)

```solidity
function createProxyWithCallback(
    address _singleton,
    bytes memory initializer,
    uint256 saltNonce,
    IProxyCreationCallback callback
) public returns (SafeProxy proxy)
```

Deploy a new proxy with `_singleton` singleton and `saltNonce` salt.
Optionally executes an initializer call to a new proxy and calls a specified callback address `callback`.


Parameters:

| Name        | Type                            | Description                                                                                                |
| :---------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------- |
| _singleton  | address                         | Address of singleton contract. Must be deployed at the time of execution.                                  |
| initializer | bytes                           | Payload for a message call to be sent to a new proxy contract.                                             |
| saltNonce   | uint256                         | Nonce that will be used to generate the salt to calculate the address of the new proxy contract.           |
| callback    | contract IProxyCreationCallback | Callback that will be invoked after the new proxy contract has been successfully deployed and initialized. |

### getChainId (0x3408e470)

```solidity
function getChainId() public view returns (uint256)
```

Returns the ID of the chain the contract is currently deployed on.


Return values:

| Name | Type    | Description                               |
| :--- | :------ | :---------------------------------------- |
| [0]  | uint256 | The ID of the current chain as a uint256. |
