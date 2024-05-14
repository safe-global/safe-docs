# FAQ

## How can I interact with the service?

Aside from using standard HTTP requests:

- [Safe{Core} API Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit)
- [Safe-eth-py](https://github.com/safe-global/safe-eth-py)
- [Safe CLI](https://github.com/safe-global/safe-cli): It has a `tx-service` mode to gather off-chain signatures.
  
More information is available in the Guides section of this documentation.

## If I add my chain to [safe-eth-py](https://github.com/safe-global/safe-eth-py/blob/master/gnosis/safe/addresses.py) will you support it?

No, for a chain to be supported, we need to set up a dedicated infra for that network and have a [proper RPC](https://docs.safe.global/safe-core-api/rpc-requirements).

## How do you handle reorgs?

When indexing, every block is marked as `not confirmed` unless it has some depth (configured via `ETH_REORG_BLOCKS` environment variable). `Not confirmed` blocks are checked periodically to check if the blockchain `blockHash` for that `number` changed before it reaches the desired number of `confirmations`. If that's the case, all blocks from that block and the related transactions are deleted, and indexing is restarted to the last `confirmed` block.

## What does the banned field mean in SafeContract model?

The `banned` field in the `SafeContract` model is used to prevent indexing certain Safes with an unsupported `MasterCopy` or unverified proxies that have issues during indexing. This field does not remove the banned Safe, and indexing can be resumed once the problem is solved.

## Why does the /v1/safes/{address} endpoint show a nonce indicating that a transaction was executed while it is not shown or marked as executed in the other endpoints?

`/v1/safes/{address}` endpoint uses `eth_call` from the RPC to get the current information for a Safe, so there's no delay, and as soon as a transaction is executed, it will be updated. The other endpoints rely on polling, indexing, decoding, and processing of traces/events, taking longer (shouldn't be more than half a minute).
