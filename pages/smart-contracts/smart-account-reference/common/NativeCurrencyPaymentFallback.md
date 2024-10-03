# NativeCurrencyPaymentFallback

## Overview

#### License: LGPL-3.0-only

```solidity
abstract contract NativeCurrencyPaymentFallback
```

Author: Richard Meissner - @rmeissner
## Events info

### SafeReceived

```solidity
event SafeReceived(address indexed sender, uint256 value)
```


## Functions info

### receive

```solidity
receive() external payable
```

Receive function accepts native currency transactions.

Emits an event with sender and received value.