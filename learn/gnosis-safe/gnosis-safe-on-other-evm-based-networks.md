# Supported networks

The full list of Safe contract deployments can be found in the [Safe deployments](https://github.com/gnosis/safe-deployments) repository on GitHub. For example, these are the [network addresses for the deployments of contract version v.1.3.0](https://github.com/safe-global/safe-deployments/tree/main/src/assets/v1.3.0).

To deploy the Safe contracts version 1.3.0 on another EVM-based chain, follow the instructions in the [safe-contracts repository](https://github.com/gnosis/safe-contracts/blob/v1.3.0/README.md#custom-networks). _Please note: The chain needs to be fully compatible, i.e. support all opcodes used by the Safe contracts._

In order to run the [Safe Web interface](https://docs.gnosis.io/safe/docs/contracts\_other\_evm/gnosis-safe.io/app/) ([Code](https://github.com/gnosis/safe-react/)), you would need to also run the backend services, in particular the [Safe client gateway](https://github.com/gnosis/safe-client-gateway/) and the [Safe transaction service](https://github.com/gnosis/safe-transaction-service) including a tracing node (see [Service Architecture](../infrastructure/service-architecture.md)).

The Safe team does not have the capacity to spin up and maintain full frontend and backend support for all EVM-based networks. All Safe related source code is open source. We encourage everyone to [deploy the canonical versions](https://github.com/gnosis/safe-contracts/blob/v1.3.0/README.md#custom-networks) of the Safe contracts to their respective networks and run the required backend and frontend parts themselves.

To add another supported network to the [safe-deployments repository](https://github.com/gnosis/safe-deployments) follow the steps outlined in the [safe-contracts repository](https://github.com/gnosis/safe-contracts/blob/v1.3.0/README.md#deployments).

Please [contact us](https://docs.gnosis-safe.io/#contact-us) with any questions.
