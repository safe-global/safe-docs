---
id: contracts_other_evm
title: Gnosis Safe on other EVM-based networks
sidebar_label: Other networks
---

The canonical versions of the Gnosis Safe smart contracts are deployed to the following networks:

- Ethereum Mainnet (Etherscan provides a good overview [here](https://etherscan.io/accounts/label/gnosis-safe).)
- Ethereum Testnets: Rinkeby, Kovan, Ropsten, Görli
- xDai
- Energy Web Chain
- Energy Web Chain Testnet: Volta

The contract addresses match on all these networks. The full list can be found in the [Safe deployments](https://github.com/gnosis/safe-deployments) repository on Github (e.g. for [v.1.3.0](https://github.com/gnosis/safe-deployments/tree/main/src/assets/v1.3.0)).

To deploy the Gnosis Safe contracts version 1.3.0 on another EVM-based chain, follow the instructions in the [safe-contracts repository](https://github.com/gnosis/safe-contracts/blob/v1.3.0/README.md#custom-networks). _Please note: The chain needs to be fully compatible, i.e. support all opcodes used by the Gnosis Safe contracts._

For deploying the canonical Gnosis Safe contracts version 1.1.1 or 1.2.0 on another EVM-based chain, please refer to the instructions [here](https://github.com/gnosis/safe-contract-deployment-replay).

In order to run the [Gnosis Safe Web interface](gnosis-safe.io/app/) ([Code](https://github.com/gnosis/safe-react/)), you would need to also run the backend services, in particular the [Safe client gateway](https://github.com/gnosis/safe-client-gateway/) and the [Safe transaction service](https://github.com/gnosis/safe-transaction-service) including a tracing node.

At Gnosis, we do not have the capacity to spin up and maintain full frontend and backend support for other EVM-based networks. All our code is open source. We encourage everyone to [deploy the canonical versions](https://github.com/gnosis/safe-contracts/blob/v1.3.0/README.md#custom-networks) of the Safe contracts to their respective networks and run the required backend and frontend parts themselves.

To add another supported network to the [safe-deployments repository](https://github.com/gnosis/safe-deployments) follow the steps outlined in the [safe-contracts repository](https://github.com/gnosis/safe-contracts/blob/v1.3.0/README.md#deployments).

Please let us know about any questions at safe@gnosis.io or via our [Discord](https://discord.gg/FPMRAwK).