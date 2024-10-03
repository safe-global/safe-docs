# IProxyCreationCallback

## Overview

#### License: LGPL-3.0-only

```solidity
interface IProxyCreationCallback
```

An interface for a contract that implements a callback function to be executed after the creation of a proxy instance.
## Functions info

### proxyCreated (0x1e52b518)

```solidity
function proxyCreated(
    SafeProxy proxy,
    address _singleton,
    bytes calldata initializer,
    uint256 saltNonce
) external
```

Function to be called after the creation of a SafeProxy instance.


Parameters:

| Name        | Type               | Description                                                      |
| :---------- | :----------------- | :--------------------------------------------------------------- |
| proxy       | contract SafeProxy | The newly created SafeProxy instance.                            |
| _singleton  | address            | The address of the singleton contract used to create the proxy.  |
| initializer | bytes              | The initializer function call data.                              |
| saltNonce   | uint256            | The nonce used to generate the salt for the proxy deployment.    |
