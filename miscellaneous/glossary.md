# Glossary

This glossary contains terms and definitions used throughout the Safe{Core} documentation.

## A

### Account

An account is a user's Ethereum account. It represents an Ethereum address and is used to sign transactions and messages. EOA (Externally Owned Account). The central vision of the Safe{Core} is to provide a safe and secure way to improve Ethereum accounts, which we call [Smart Accounts](#smart-accounts).

### Account Abstraction

Account abstraction is a term used to describe the process of abstracting the concept of an account. It's a way to improve the security of Ethereum accounts by adding a layer of abstraction on top of them, adding features for [recoverability](#recoverability), [social logins](#social-login), and [gasless transactions](#gasless-transactions). This abstraction layer is our central concept to build Safe's vision for modular [Smart Accounts](#smart-accounts).

### Apps

Safe Apps are web applications that can interact with Safe. They're used to provide a better user experience when interacting with Safe and internally use the [Safe Apps SDK](../safe-apps/README.md). They can interact with Safe{Wallet} and fully utilize its main features, such as [transactions](#transactions) and [modules](#modules). The [Safe App Gallery](https://app.safe.global/apps) displays all the Apps that any Safe{Wallet} user can use.

### AuthKit

The AuthKit is a library of the Safe{Core} SDK that provides a set of tools to authenticate users with one of the different [Social Login](#social-login) methods offered, generating an externally owned account that can act as the signer of a Safe.

## G

### Gasless Transactions

Gasless transactions are [Ethereum transactions](#transactions) that are paid for by a third party. They can be paid for by a [relayer](#relayers) or a Safe{Wallet} user's Safe. They're used to provide a better user experience by removing the need for users to pay for gas fees or even having to buy cryptocurrency altogether when interacting with a blockchain.

## N

### Networks

Networks are Ethereum-based ledgers. They're used to store transactions and smart contracts. They're also used to transfer funds from one account to another or as a support to interact with smart contracts.

## P

### Plugins

Plugins are a way to extend the functionality of Safe{Core} by adding custom features to it. They're used to add support for new [modules](#modules) or [guards](#guards) to a Safe.

## R

### Relayers

Relayers are third-party services that can pay for gas fees on behalf of users. They're used to provide [gasless transactions](#gasless-transactions) to Safe users.

## S

### Safes

Safes are smart contracts used to store funds and execute transactions on behalf of their owners. They have an Ethereum address and provide multiple features, making it as easy as possible. They're the main output from [Safe](https://safe.global)'s vision for modular [Smart Accounts](#smart-accounts).

### Safe{Core}

Safe{Core} is a set of smart contracts and Typescript packages used to build Safe{Wallet}.

### Safe{Wallet}

Safe{Wallet} is the official user interface to manage Safe accounts. It can sign transactions and messages and interact with other smart contracts from the web, at [app.safe.global](https://app.safe.global), or from a mobile device, using the [Safe{Wallet} mobile app](https://safe.global/wallet). It uses the Safe{Core} SDK internally.

### Safe{RecoveryHub}

Safe{RecoveryHub} is a process used to describe recovering access to a Safe. It's a way to improve the security of Safes by enabling Safe owners to split control of their Safe with a decentralized committee selected by Safe{DAO}. You can know more by reading the [Safe Recovery](https://help.safe.global/en/articles/110656-account-recovery-with-safe-recoveryhub) guide.

### Safe Guards

Guards are smart contracts that can protect Safe transactions. They're used to add an extra layer of security to Safe transactions by adding custom rules to them before or after a transaction. For example, a guard can protect a Safe transaction from being executed if a specific user doesn't sign the transaction.

### Safe Modules

Safe Modules add custom features to Safe contracts. Smart contracts add functionality to Safe while separating module logic from Safe's core contracts, such as support for [gasless transactions](#gasless-transactions) or [allowances](https://github.com/safe-global/safe-modules/tree/master/allowances).

## T

### Transactions‡

Transactions are what change the state of Ethereum-based ledgers. They're used to transfer funds from one account to another or to interact with smart contracts. You can learn more about how Safe{Wallet} handles transactions by reading the [Transactions](https://help.safe.global/en/collections/9814-transactions) section of our [Support Center](help.safe.global).

## W

### Wallet

A wallet is a piece of software used to manage Ethereum accounts. It can sign transactions and messages and interact with smart contracts.

### WalletConnect

WalletConnect is a protocol for connecting decentralized applications to mobile wallets with QR code scanning or deep linking. It can link Safe{Wallet} to other decentralized applications. You can follow [this guide](https://help.safe.global/en/articles/108235-how-to-connect-a-safe-to-a-dapp-using-walletconnect) to know more.
