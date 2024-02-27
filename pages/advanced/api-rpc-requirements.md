# RPC Requirements

### What are the RPC requirements for the Transaction Service?

To run the Transaction Service in **tracing mode** you will need a tracing compatible node:

* [Erigon ](https://github.com/ledgerwatch/erigon)node (recommended).
* Deprecated [OpenEthereum ](https://github.com/openethereum/openethereum)node with tracing enabled (`--tracing` flag) if it's still supported on your network.
* [Nethermind ](https://nethermind.io/)(**archive mode** so tracing is enabled).
* **Any RPC** that supports **eth_getLogs** if using the **Safe L2 Version.** From Safe **v1.3.0** there's an alternative and **recommended way** to avoid using tracing, the **L2 Safe version** ([https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/gnosis_safe_l2.json](https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/gnosis_safe_l2.json)) that emits events, so no tracing node is required. This is the approach used in networks like _Polygon_ or _Binance Smart Chain_ where fees are cheap and emitting events don't impact the user:
  * A Transaction Service configured **with a tracing** node can index L2 and non L2 versions of the Safe contracts.
  * A Transaction Service configured **without a tracing** node can only index L2 versions of the Safe contracts. Indexing mode shouldn't be changed after initializing the service, as the database could become corrupted, so if a tracing node wasn't set up it shouldn't be added later. The opposite is also problematic.

### What RPC methods are used?

For indexing, basic RPC methods are required, and the service uses _batching_ to query the RPC:

* `eth_getTransactionByHash`
* `eth_getBlockByNumber`
* `eth_getTransactionReceipt`
* `eth_getLogs` (for indexing ERC20/721 transfers)
* `eth_chainId` (just called once and cached)
* ...

For the regular version of the Safe (not L2), tracing endpoints are used:

* ​[trace_filter](https://openethereum.github.io/JSONRPC-trace-module#trace_filter): For quick sync, but it could be disabled setting the configuration parameter `ETH_INTERNAL_NO_FILTER=False` . Be careful, it will make the service really slow when syncing from scratch.
* ​[trace_block](https://openethereum.github.io/JSONRPC-trace-module#trace_block)​
* ​[trace_transaction](https://openethereum.github.io/JSONRPC-trace-module#trace_transaction)​

For the L2 version of the Safe, no special RPC methods are used. The most demanding one will be [eth_getLogs](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) to get the Safe events.

### How many queries will the Transaction Service do to the RPC?

That's not written in stone. Transaction Service has some environment variables that can be configured to set a limit on the number of blocks that are processed together (`ETH_EVENTS_BLOCK_PROCESS_LIMIT_MAX`), but the default behaviour is trying to detect the best configuration for every network similar to how [TCP congestion control](https://en.wikipedia.org/wiki/TCP_congestion_control) works. Indexer tries to process a low number of blocks (currently 50). Depending on that:

* If the request takes **less than 1 second**, the node can process more. The number of blocks to fetch is duplicated for the next request.
* If the request takes **less than 3 seconds**, the number of blocks to process is incremented by a small amount (currently 20).
* If the request takes **more than 20 seconds**, the number of blocks to process is decremented by a small amount (currently 20).
* If the request takes **more than 30 seconds**, the number of blocks to process is halved.
* If there is **an exception** when requesting the information (I/O error) number of blocks to process is reset to the minimum number of blocks (currently 1).
* All this happens in every request to the node used for indexing (safe transactions, erc20/721 events...).

Be careful, some nodes like **Binance Smart Chain** public nodes have a hard-coded limit of blocks they can process (_5000_ in the case of BSC). Set `ETH_EVENTS_BLOCK_PROCESS_LIMIT_MAX` to prevent the algorithm from trying to process more blocks and raise errors all the time

## **RPC Provider expectations**

For RPC providers we expect communication on every update and configuration change as it could impact our indexers:

* **Timeout** for the requests.
* **Number of** **batch requests** allowed in the same HTTP request.
* **Block range** that can be queried in queries like **eth_getLogs** or **trace_filter.**
* **Results limit for endpoints** (for example some providers implement a limit to the number of results of queries like **eth_getLogs**). Indexer is expecting a failure and not getting capped results.
