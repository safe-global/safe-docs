---
description: Up-to-date overview document on how our services interact with each other
---

# Service Architecture

The Safe infrastracture consists of 3 services:

* [Safe Transaction Service](https://github.com/gnosis/safe-transaction-service/): Keeps track of transactions related to Safe contracts (Python)
* [Safe Config Service](https://github.com/gnosis/safe-config-service): Keeps track of all supported networks and chain-specific variables (Python)
* [Safe Client Gateway](https://github.com/gnosis/safe-client-gateway/): Uses the config service to determine how to reach the core service instance required for a given request (Rust)

[Safe Infrastructure](https://github.com/safe-global/safe-infrastructure/) and the [running our services locally guide](https://github.com/safe-global/safe-infrastructure/blob/main/docs/running_locally.md) shows how to run all our infrastructure together; including how to run the Safe UI, Safe {Wallet} and the backend, Safe {Core}.

As you can see from Fig. 1 , our full production setup is a mixture of several instances of the Safe Transaction Service (from now on referred to as "core service") orchestrated by the Safe Config Service (henceforth referred to as "config service") which are later consumed by the Safe Client Gateway (here on after referred to as "client gateway").

![Fig 1. Broad view of the backend services and their components.](<../../.gitbook/assets/Slide 16\_9 - 2.png>)

## Safe Transaction Service

The transaction services use event indexing to keep track of transactions related to our safe contracts. There is one instance of the core services per supported network (mainnet, goerli, gnosis chain, polygon, among others).

## Safe Config Service

The config services keeps track of all the networks we support and therefore of all the instances of the core services that are available. In addition to this, the config service provides information regarding chain dependant variables such as RPC endpoints, gas price oracles, in which URL a given core service instance for a chain can be reached, among other things.

## Safe Client Gateway

The client gateway leverages the config services to determine how to reach the core service instance required for a given request. If the network is supported (which is determined by the config service, as aforementioned) the client gateway forwards the request to the given core service instance. The client gateway transforms (and sometimes aggregates) data sources from the core services, catering specifically to the UI needs of our frontend clients. This process is illustrated in Fig. 2

![Fig 2.  Service interaction diagram.](<../../.gitbook/assets/Slide 16\_9 - 3 (1).png>)

Even though currently our config and core services instances are reachable by clients that are not the client gateway, in the future we may change this; the client gateway was conceived as the outermost component of our infrastructure, therefore ideally should be the single point of communication with any frontend client.
