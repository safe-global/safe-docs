---
description: An overview of how our services interact with each other
---

# Service architecture

The Safe infrastructure consists of four services:

* [Safe Transaction Service](https://github.com/safe-global/safe-transaction-service): Keeps track of transactions related to Safe contracts (Python).
* [Safe Events Service](https://github.com/safe-global/safe-events-service): Handles Safe indexing events from the Transaction Service and delivers them as HTTP webhooks.
* [Safe Config Service](https://github.com/safe-global/safe-config-service): Keeps track of all supported networks and chain-specific variables (Python). Also referred to as *config service*.
* [Safe Client Gateway](https://github.com/safe-global/safe-client-gateway-nest): Uses the config service to determine how to reach the transaction service instance required for a given request (Node.js). Also referred to as *client gateway*.

Safe's production setup is a mixture of several instances of the Safe Transaction Service orchestrated by the config service, later consumed by the client gateway.

![Overview of the backend services and their components.](<../.gitbook/assets/diagram-services.png>)

## Safe Transaction Service

The transaction service uses tracing in Mainnet/Goerli and Gnosis Chain and event indexing in other chains to keep track of transactions related to Safe contracts. One instance of the transaction service runs per supported network (Mainnet, Goerli, Gnosis Chain, Polygon, among others).

## Safe Config Service

The config service keeps track of all the supported networks and all the available transaction service instances. The config service also provides information about chain-dependent variables such as RPC endpoints, gas price oracles, and URLs where the transaction service instance for a chain can be reached, among other things.

## Safe Client Gateway

The client gateway leverages the config service to determine how to reach the transaction service instance required for a specific request. The client gateway forwards the request to the specified transaction service instance if the network is supported (determined by the config service). The client gateway transforms, aggregates, and caches information from the config and transaction services, optimizing data for Safe's web and mobile clients.

![Service interaction diagram.](<../.gitbook/assets/diagram-services-requests.png>)

Even though our config and transaction service instances are reachable by clients that are not the client gateway, this may change in the future. The client gateway was meant to be the outermost component of our infrastructure and the single point of communication with any frontend client.

## Running locally

[Safe Infrastructure](https://github.com/safe-global/safe-infrastructure) and the [running our services locally guide](https://github.com/safe-global/safe-infrastructure/blob/main/docs/running_locally.md) show how to run all of Safe's infrastructure (Safe UI, Safe{Wallet} and the backend, and Safe{Core}). Note that these documents are examples of how these services run, and the configuration should be adapted to the specific needs.
