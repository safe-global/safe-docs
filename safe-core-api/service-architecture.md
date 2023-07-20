---
description: Up-to-date overview document on how our services interact with each other
---

# Service architecture

The Safe infrastructure consists of 4 services:

* [Safe Transaction Service](https://github.com/safe-global/safe-transaction-service): Keeps track of transactions related to Safe contracts (Python)
* [Safe Events Service](https://github.com/safe-global/safe-events-service): Handles Safe indexing events from the Transaction Service and delivers them as HTTP webhooks.
* [Safe Config Service](https://github.com/safe-global/safe-config-service): Keeps track of all supported networks and chain-specific variables (Python)
* [Safe Client Gateway](https://github.com/safe-global/safe-client-gateway): Uses the config service to determine how to reach the transaction service instance required for a given request (Rust)

[Safe Infrastructure](https://github.com/safe-global/safe-infrastructure) and the [running our services locally guide](https://github.com/safe-global/safe-infrastructure/blob/main/docs/running_locally.md) shows how to run all our infrastructure together; including how to run the Safe UI, Safe {Wallet} and the backend, Safe {Core}. Note that this document is only an example of how these services are run and you should adapt the configuration to your specific needs.

As you can see from Fig. 1 , our full production setup is a mixture of several instances of the Safe Transaction Service orchestrated by the Safe Config Service (henceforth referred to as "config service") which are later consumed by the Safe Client Gateway (here on after referred to as "client gateway").

![Fig 1. Broad view of the backend services and their components.](<../.gitbook/assets/diagram-services.png>)

## Safe Transaction Service

The transaction service uses tracing in Mainnet/Goerli and Gnosis Chain, and event indexing in other chains to keep track of transactions related to our safe contracts. There is one instance of the transaction service per supported network (mainnet, goerli, gnosis chain, polygon, among others).

## Safe Config Service

The config service keeps track of all the networks we support and therefore of all the instances of the transaction service that are available. In addition to this, the config service provides information regarding chain dependent variables such as RPC endpoints, gas price oracles, in which URL a given transaction service instance for a chain can be reached, among other things.

## Safe Client Gateway

The client gateway leverages the config service to determine how to reach the transaction service instance required for a given request. If the network is supported (which is determined by the config service, as aforementioned) the client gateway forwards the request to the given transaction service instance. The client gateway transforms, aggregates and caches information from the config service and the transaction service, optimizing data for our web and mobile clients. This process is illustrated in Fig. 2

![Fig 2. Service interaction diagram.](<../.gitbook/assets/diagram-services-requests.png>)

Even though currently our config and transaction service instances are reachable by clients that are not the client gateway, in the future we may change this; the client gateway was conceived as the outermost component of our infrastructure, therefore ideally should be the single point of communication with any frontend client.
