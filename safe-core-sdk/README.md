# Safe{Core} Account Abstraction SDK

The Safe{Core} AA SDK main purpose is to bring Account Abstraction to life by focusing on integrating Safe with different third parties that can be provided to developers and users to abstract the complexity that comes with setting a smart contract account.

Links of interest:
- [Safe{Core} Account Abstraction SDK](https://github.com/safe-global/safe-core-sdk)
- [Safe{Core} Account Abstraction SDK Demo Application](https://github.com/5afe/account-abstraction-demo-ui)


## Architecture

This set of integrations are grouped in different kits, which are very important pillars and we aim to providing the right tools to developers to reproduce a web2-like user experience.

<img src="../.gitbook/assets/diagram-safe-core-sdk.png" alt="">

### Auth Kit

The `Auth Kit` creates externally-owned accounts and authenticates them using an email address, a social media account or another crypto wallet account.

### Protocol Kit

The `Protocol Kit` facilitates the interaction with the Safe contracts and allows the creation of new accounts, update the configuration, sign and execute transactions, among other features.

### OnRamp Kit

The `OnRamp Kit` allows users to buy cryptocurrencies with fiat money to fund a Safe account via a credit card or other payment methods.

### Relay Kit

The `Relay Kit` relays Safe transactions allowing to get them sponsored by a third party or paid with any supported ERC-20 token that is secured by the Safe itself.

### API Kit

The `API Kit` facilitates the interaction with the Safe Transaction Service API allowing to share transactions among the signers, get information from a Safe like the configuration or transaction history, among other features.
