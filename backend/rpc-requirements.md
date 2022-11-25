# RPC Requirements

### What are the RPC requirements for the tx service? <a href="#what-are-the-rpc-requirements-for-the-tx-service" id="what-are-the-rpc-requirements-for-the-tx-service"></a>

To run the tx service in **tracing mode** you will need a [Erigon ](https://github.com/ledgerwatch/erigon)node running. Also you can use a deprecated [OpenEthereum ](https://github.com/openethereum/openethereum)node with tracing enabled (`--tracing` flag) if it's still supported on your network. We are evaluating the use of [Nethermind](https://nethermind.io/), it needs to be run in _archive_ mode.From Safe **v1.3.0** there's an alternative and **recommended way** to avoid using tracing, using the **L2 Safe version** ([https://github.com/gnosis/safe-deployments/blob/main/src/assets/v1.3.0/gnosis\_safe\_l2.json](https://github.com/gnosis/safe-deployments/blob/main/src/assets/v1.3.0/gnosis\_safe\_l2.json)) that emits events, so no tracing node is required (any node supporting `eth_getLogs` will work). This is the approach used in networks like _Polygon_ or _Binance Smart Chain_ where fees are cheap and emitting events don't impact the user.A tx service configured with a **tracing** node can index L2 and non L2 versions of the Safe contracts. A tx service configured without a **tracing** node can only index L2 versions of the Safe contracts.Indexing mode should not be changed after initializing the service, as the database could become corrupted, so if a tracing node was not set up it shouldn't be added later. The opposite is also problematic.

### What RPC methods are used? <a href="#what-rpc-methods-are-used" id="what-rpc-methods-are-used"></a>

For indexing, basic RPC methods are required, and the service uses _batching_ to query the RPC:

* eth\_getTransactionByHash
* eth\_getBlockByNumber
* eth\_getTransactionReceipt
* eth\_getLogs (for indexing ERC20/721 transfers)
* eth\_chainId (just called once and cached)
* ...

For the regular version of the Safe (not L2), tracing endpoints are used:

* ​[trace\_filter](https://openethereum.github.io/JSONRPC-trace-module#trace\_filter): For quick sync, but it could be disabled setting the configuration parameter `ETH_INTERNAL_NO_FILTER=False` . Be careful, it will make the service really slow when syncing from scratch.
* ​[trace\_block](https://openethereum.github.io/JSONRPC-trace-module#trace\_block)​
* ​[trace\_transaction](https://openethereum.github.io/JSONRPC-trace-module#trace\_transaction)​

For the L2 version of the Safe, no special RPC methods are used. The most demanding one will be [eth\_getLogs](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth\_getlogs) to get the Safe events.

### How many queries will the tx service do to the RPC? <a href="#how-many-queries-will-the-tx-service-do-to-the-rpc" id="how-many-queries-will-the-tx-service-do-to-the-rpc"></a>

That's not written in stone. Tx service has some environment variables that can be configured to set a limit on the number of blocks that are processed together (`ETH_EVENTS_BLOCK_PROCESS_LIMIT_MAX`), but the default behaviour is trying to detect the best configuration for every network similar to how [TCP congestion control](https://en.wikipedia.org/wiki/TCP\_congestion\_control) works.Indexer tries to process a low number of blocks (currently 50). Depending on that:

* If request takes **less than 1 second**, node can process more. Number of blocks to fetch is duplicated for the next request.
* If request takes **less than 3 seconds**, number of blocks to process are incremented by an small amount (currently 20).
* If request takes **more than 20 seconds**, number of blocks to process are decremented by an small amount (currently 20).
* If request takes **more than 30 seconds**, number of blocks to process are halved.
* If there is **an exception** when requesting the information (I/O error) number of blocks to process is reset to the minimum number of blocks (currently 1).
* All this happens in every request to the node used for indexing (safe transactions, erc20/721 events...).

Be careful, some nodes like **Binance Smart Chain** public nodes have a hardcoded limit of blocks they can process (_5000_ in the case of BSC). Set`ETH_EVENTS_BLOCK_PROCESS_LIMIT_MAX`to prevent the algorithm trying to process more blocks and erroring all the time
