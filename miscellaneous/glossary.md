# Glossary

This glossary is a collection of terms and definitions used throughout the Safe{Core} documentation.

## A

### Account

An account is a user's Ethereum account. It is represented by an Ethereum address and is used to sign transactions and messages. It can also be found as a EOA (Externally Owned Account). The main vision of the Safe{Core} is to provide a safe and secure way to improve Ethereum accounts, that we refer to as [Smart Accounts](#smart-accounts).

### Account Abstraction

Account abstraction is a term used to describe the process of abstracting the concept of an account. It is a way to improve the security of Ethereum accounts by adding a layer of abstraction on top of them, adding features for [recoverability](#recoverability), [social logins](#social-login) and [gasless transactions](#gasless-transactions). This layer of abstraction is the main concept we use to build Safe's vision for modular [Smart Accounts](#smart-accounts).

### Apps

Safe Apps are web applications that can be used to interact with Safe. They are used to provide a better user experience when interacting with Safe, and are mostly built using the [Safe Apps SDK](../safe-apps/README.md). They can be used to interact with Safe's core features, such as [transactions](#transactions) and [modules](#modules), or to provide entirely new features. They are gathered in the a [Safe App Gallery](https://app.safe.global/apps) and can be used by any Safe{Wallet} user.

### AuthKit

AuthKit is a part of the Safe{Core} SDK that provides a set of tools to authenticate users and sign messages. It is used to sign transactions and messages with the user's Ethereum account. It also provides a set of tools to authenticate users with more familiar web services, such as Gmail. In this last case, we talk about [Social Login](#social-login).

## G

### Gasless Transactions

Gasless transactions are [Ethereum transactions](#transactions) that are paid for by a third-party. They can either be paid for by a [relayer](#relayers), or by a Safe{Wallet} user's Safe. They are used to provide a better user experience by removing the need for users to pay for gas fees, or even having to buy cryptocurrency altogether when interacting with a blockchain.

### Guards

Guards are smart contracts that are used to protect Safe transactions. They are used to add an extra layer of security to Safe transactions by adding custom rules to them before and/or after a transaction. For example, a guard can be used to protect a Safe transaction from being executed if the transaction is not signed by a specific user.

## M

### Modules

Safe Modules add custom features to Safe contracts. They are smart contracts that add functionality to Safe while separating module logic from Safe's core contracts, such as support for [gasless transactions](#gasless-transactions) or [allowances](https://github.com/safe-global/safe-modules/tree/master/allowances).

## P

### Plugins

Plugins are a way to extend the functionality of Safe{Core} by adding custom features to it. They are used to add support for new [modules](#modules) or [guards](#guards) to a Safe.

## R

### Recoverability

Recoverability is a term used to describe the process of recovering access to a Safe. It is a way to improve the security of Safes by enabling Safe owners to split control of their Safe with a decentralized committee selected by Safe{DAO}.

### Relayers

Relayers are third-party services that can be used to pay for gas fees on behalf of users. They are used to provide [gasless transactions](#gasless-transactions) to Safe users.

## S

### Safe

A Safe is a smart contract that is used to store funds and execute transactions on behalf of its owners. It is represented by an Ethereum address and is supercharged with features making it as easy as possible to use. It is the main output from Safe's vision for modular [Smart Accounts](#smart-accounts).

### Safe{Core}

Safe{Core} is a set of smart contracts and Typescript packages that are used to build Safe{Wallet}.

### Safe{Wallet}

Safe{Wallet} is a web and mobile wallet UI that is used to manage Safes. It is used to sign transactions and messages, and to interact with other smart contracts from the web, at [app.safe.global](https://app.safe.global), or from a mobile device, using the [Safe{Wallet} mobile app](https://safe.global/wallet). It is built entirely using the [Safe{Core} SDK](../safe-core-sdk/README.md).

## T

### Transactions

Transactions are what change the state of Ethereum-based ledgers. They are used to transfer funds from one account to another, or to interact with smart contracts.

## W

### Wallet

A wallet is a software that is used to manage Ethereum accounts. It is used to sign transactions and messages, and to interact with smart contracts.

### WalletConnect

WalletConnect is a protocol for connecting decentralized applications to mobile wallets with QR code scanning or deep linking.

## Z

### Zero-Knowledge Proofs

ZKPs (Zero-Knowledge Proofs) are cryptographic proofs that can be used to prove the validity of a statement without revealing any information about it.