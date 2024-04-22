## New Supported Chains

Safe's vision is to make every Web3 account a smart account. Therefore, we prioritize teams and chains building with smart accounts, especially if they push account abstraction (for example, ERC-4337/EIP-1271 adoption) with Safe (learn more [here](https://docs.safe.global/home/4337-safe)).

To have the full Safe stack running on your chain network. You need to consider each of these steps:

### Deploy Safe canonical contracts

**Process**

- Follow all the steps in the [safe-contracts](https://github.com/safe-global/safe-contracts#deploy) GitHub repository.
- Create a Pull Request in the [safe-deployments](https://github.com/safe-global/safe-deployments) GitHub repository. 

**Cost**

The contracts are fully open source, but gas is needed in the native currency of the new chain for contract deployment.

**Timeline**

Pull Requests on Safe's GitHub are reviewed roughly on a two-week cadence.

**EVM only**

Safe's security is based on the contracts deployed in EVM-compatible networks. For the time being, we are not looking to extend beyond EVM.

### Safe{Wallet} interface and Safe{Core} infrastructure

**Process**

- You will need a dedicated team to run Safe's front-end and back-end services. Two options are available:
  - Native integration ([app.safe.global](https://app.safe.global)): Supported by the Safe team
    - Fill out this form: https://noteforms.com/forms/request-safe-ui-and-infra-support-4weugt
    - The Safe team evaluates additional chains that need Wallet/Core support every quarter based on a priority matrix. 
  - Forked integration: Can be run by the new chain itself or via an ecosystem third party like [Protofire](https://protofire.io) or [Den](https://www.onchainden.com).
- Enter into agreement with your chosen provider.

**Cost**

- Safe is fully open source but requires someone to run and maintain the [web interface](https://github.com/safe-global/safe-wallet-web) and [infrastructure](https://github.com/safe-global/safe-infrastructure/blob/main/docs/running_production.md)
- Cost is based on an individual agreement if run by any third party (including Safe).
- Primary cost factors:
  - Deployment costs.
  - Indexing.
  - Cloud storage and monitoring services.

**Timeline**

- Based on individual agreement
- Prioritisation for native integration ([app.safe.global](https://app.safe.global)) is primarily based on the network's smart account/account abstraction strategy (for example: is every user account a Safe under the hood beyond the usage of Safe as a multi-signature for treasury management?) and [additional gathered metrics](https://noteforms.com/forms/request-safe-ui-and-infra-support-4weugt).
