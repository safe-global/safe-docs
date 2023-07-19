# Safe{Core} Account Abstraction SDK

The Safe{Core} AA SDK main purpose is to bring Account Abstraction to life by focusing on integrating Safe with different third parties that can be provided to developers and users to abstract the complexity that comes with setting a smart contract account.

This set of integrations are grouped in different kits, which are very important pillars and we aim to providing the right tools to developers to reproduce a web2-like user experience.

### [Auth Kit](auth-kit/)

The [Auth Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit) creates externally-owned accounts and authenticates them using an email address, a social media account or another crypto wallet account.

### [Protocol Kit](protocol-kit/)

The [Protocol Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit) facilitates the interaction with the [Safe contracts](https://github.com/safe-global/safe-contracts) and allows the creation of new accounts, update the configuration, sign and execute transactions, among other features.

### [OnRamp Kit](onramp-kit/)

The [OnRamp Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit) allows users to buy cryptocurrencies with fiat money to fund a Safe account via a credit card or other payment methods.

### [Relay Kit](relay-kit/)

The [Relay Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/relay-kit) relays Safe transactions allowing to get them sponsored by a third party or paid with any supported ERC-20 token that is secured by the Safe itself.

### [API Kit](api-kit/)

The [API Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit) facilitates the interaction with the [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service) allowing to share transactions among the signers, get information from a Safe like the configuration or transaction history, among other features.
