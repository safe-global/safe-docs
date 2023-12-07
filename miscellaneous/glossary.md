# Glossary

This glossary contains terms and definitions used throughout the Safe{Core} documentation.

## A

### Account Abstraction

Account abstraction is a term used to describe abstracting the concept of an Externally Owned Account (EOA). It's a way to improve the security of Ethereum accounts by adding a layer of abstraction on top of them, effectively turning them into [Smart Accounts](#smart-accounts). This abstraction layer is our central concept for building Safe's vision, as you can read more [here](https://docs.safe.global/safe-smart-account/safe-smart-account).

### AuthKit

The AuthKit is a library of the Safe{Core} SDK that provides a set of tools to authenticate users with one of the different [Social Login](#social-login) methods offered, generating an externally owned account that can act as the signer of a Safe.

## E

### Externally Owned Accounts

An Externally Owned Account (or EOA) is one of the two types of [accounts on Ethereum](https://ethereum.org/en/whitepaper/#ethereum-accounts). It represents an Ethereum address and is used to sign transactions and messages. It was introduced by the Ethereum whitepaper, along with the other type of accounts: smart contracts. The central vision of Safe is to provide safe and secure tools for users to interact with the blockchain, and moving from EOAs to [Smart Accounts](#smart-accounts) is its primary way of achieving this vision.

## G

### Gasless Transactions

Gasless transactions are [Ethereum transactions](#transactions) that are paid for by a third party. They can be paid for by a [relayer](#relayers) or a Safe{Wallet} user's Safe. They're used to provide a better user experience by removing the need for users to pay for gas fees or even having to buy cryptocurrency altogether when interacting with a blockchain.

## N

### Networks

Networks are Ethereum-based ledgers. They're used to store transactions and smart contracts. They're also used to transfer funds from one account to another or as a support to interact with smart contracts. You can find a list of supported networks by Safe{Core} Protocol [here](../safe-smart-account/supported-networks.md) and the list of the ones supported by Safe{Core} API [here](../safe-core-api/supported-networks).

## P

### Plugins

Plugins are a way to extend the functionality of Safe{Core} by adding custom features to it. They're used to add support for new [modules](#modules) or [guards](#guards) to a Safe.

## R

### Relayers

Relayers are third-party services that can pay for gas fees on behalf of users. They're used to provide [gasless transactions](#gasless-transactions) to Safe users.

## S

### Safe{Core}

Safe{Core} is a set of smart contracts and Typescript packages used to build Safe{Wallet} and other open-source wallets with security and usability in mind.

### Safe{Core} API

[Safe{Core} API](../safe-core-api/service-architecture) is a set of REST APIs built to interact more easily with [Safe{Core} Protocol](#safecore-protocol). The [Safe{Core} SDK API Kit](../safe-core-aa-sdk/api-kit) is a TypeScript client for this API.

### Safe{Core} SDK

Safe{Core} SDK is a Typescript library built to interact with Safe{Core} Protocol. Safe{Wallet} interacts with Safes by using it internally.

### Safe{Core} Protocol

[Safe{Core} Protocol](https://docs.safe.global/safe-core-protocol/safe-core-protocol) is a set of smart contracts used to build [Safe Smart Accounts](#safe-smart-accounts). It's the core of the Safe ecosystem, and Safe{Wallet} relies on it to interact with Safes via [Safe{Core} SDK Protocol Kit](https://docs.safe.global/safe-core-aa-sdk/protocol-kit), which allows developers to interact with the protocol using TypeScript. You can read more on the protocol architecture [here](https://safe.mirror.xyz/t76RZPgEKdRmWNIbEzi75onWPeZrBrwbLRejuj-iPpQ).

### Safe{DAO}

Safe{DAO} is a decentralized autonomous organization that governs the Safe ecosystem. It manages the Safe{Core} smart contracts and parts of the Safe{RecoveryHub} process. You can know more by visiting the [Safe{DAO}](https://governance.safe.global/) governance portal.

### Safe{Wallet}

Safe{Wallet} is the official user interface to manage Safe accounts. It can sign transactions and messages and interact with other smart contracts from the web, at [app.safe.global](https://app.safe.global), or from a mobile device, using the [Safe{Wallet} mobile app](https://safe.global/wallet). It uses the Safe{Core} SDK internally.

<!-- ### Safe{RecoveryHub}

Safe{RecoveryHub} is a process used to describe recovering access to a Safe. It's a way to improve the security of Safes by enabling Safe owners to split control of their Safe with a decentralized committee selected by Safe{DAO}. You can know more by reading the [Safe Recovery](https://help.safe.global/en/articles/110656-account-recovery-with-safe-recoveryhub) guide. -->

### Safe Apps

Safe Apps are web applications that can interact with Safe. They're used to provide a better user experience when interacting with Safe and internally use the [Safe Apps SDK](../safe-apps/README.md). They can interact with Safe{Wallet} and fully utilize its main features, such as [transactions](#transactions) and [modules](#modules). The [Safe App Gallery](https://app.safe.global/apps) displays all the Apps that any Safe{Wallet} user can use.

### SafeAuth

SafeAuth is a part of the [Safe{Core} SDK Auth Kit](https://docs.safe.global/safe-core-aa-sdk/auth-kit) that provides tools to authenticate users with one of the different [Social Login](#social-login) methods offered, thanks to our integration with [Web3Auth](https://web3auth.io/) generating an externally owned account that can act as a [Safe Smart Account](#safe-smart-accounts) signer. You can know more by reading the [Safe Auth](https://docs.safe.global/safe-core-aa-sdk/auth-kit/guides/safe-auth) guide.

### Safe Guards

Guards are smart contracts that can protect Safe transactions. They're used to add an extra layer of security to Safe transactions by adding custom rules to them before or after a transaction. For example, a guard can protect a Safe transaction from being executed if a specific user doesn't sign the transaction.

### Safe Modules

Safe Modules add custom features to Safe contracts. Smart contracts add functionality to Safe while separating module logic from Safe's core contracts, such as support for [gasless transactions](#gasless-transactions) or [allowances](https://github.com/safe-global/safe-modules/tree/master/allowances).

### Safe Smart Accounts

Safe Smart Accounts (sometimes known as Smart Contract Wallets, Smart Wallets, or Contract Wallets) is a way to improve the security of Ethereum [Externally Owned Accounts](#externally-owned-account) by adding a layer of abstraction on top of them, adding features for recovery, [social logins](#social-login), and [gasless transactions](#gasless-transactions). They are [smart contracts](https://ethereum.org/en/whitepaper/#scripting) used to store funds and execute transactions on behalf of their owners. This abstraction layer is our central concept for building [Safe's vision](https://docs.safe.global/safe-smart-account/safe-smart-account).

### Singleton

Singleton is a term used to describe a smart contract that can only be deployed once. It describes the [Safe{Core} Proxy](https://github.com/safe-global/safe-contracts/blob/main/contracts/proxies/SafeProxy.sol) smart contract deployed once on each [supported network](../safe-smart-account/supported-networks.md) so that all future Safes deployed on these networks can delegate transactions and function calls to it.

## T

### Transactions‡

Transactions are what change the state of Ethereum-based ledgers. They're used to transfer funds from one account to another or to interact with smart contracts. You can learn more about how Safe{Wallet} handles transactions by reading the [Transactions](https://help.safe.global/en/collections/9814-transactions) section of our [Support Center](https://help.safe.global).

## W

### Wallet

A wallet is a piece of software used to manage Ethereum accounts. It can sign transactions and messages and interact with smart contracts.

<!-- ### WalletConnect

WalletConnect is a protocol for connecting decentralized applications to mobile wallets with QR code scanning or deep linking. It can link Safe{Wallet} to other decentralized applications. You can follow [this guide](https://help.safe.global/en/articles/108235-how-to-connect-a-safe-to-a-dapp-using-walletconnect) to know more. -->
