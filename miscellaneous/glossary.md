# Glossary

This glossary contains terms and definitions used throughout the Safe{Core} documentation.

## A

### Account Abstraction

Account abstraction is a term used to describe abstracting the concept of an Externally Owned Account (EOA). It's a way to improve the security of Ethereum accounts by adding a layer of abstraction on top of them, effectively turning them into [Smart Accounts](#smart-accounts). This abstraction layer is our central concept for building Safe's vision, as you can read more [here](https://docs.safe.global/safe-smart-account/safe-smart-account).

### AuthKit

The AuthKit is a library of the Safe{Core} SDK that provides a set of tools to authenticate users with one of the different [Social Login](#social-login) methods offered, generating an externally owned account that can act as the signer of a Safe.

## B

### Bundlers

Bundlers are third-party off-chain services that can pay for gas fees on behalf of users. They're used to provide [gasless transactions](#gasless-transactions) in the context of [ERC-4337](#erc-4337) by broadcasting [UserOperations](#userops) as full-fledged Ethereum transactions. You can know more by reading the [Bundlers](https://erc4337.io/docs/bundlers/introduction) section of the 4337 Standard.

## E

### EIP-1271

[EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) is an Ethereum Improvement Proposal describing a standard contract interface to verify signatures and hashes. Both Safe{Core} [Protocol](#safecore-protocol) and [SDK](#safecore-sdk) use it to verify signatures on Safe transactions and enable off-chain functionalities.

### EIP-712

[EIP-712](https://eips.ethereum.org/EIPS/eip-712) is an Ethereum Improvement Proposal describing a typed data hashing and signing standard. All Safe{Core} [Protocol](#safecore-protocol) and [SDK](#safecore-sdk) transactions follow this standard, making them compatible with [EIP-1271](#eip-1271) signature verification.

### ERC-4337

[ERC-4337](https://erc4337.io/) is an Ethereum Request for Comments describing a standard for a [Safe Module](#safe-modules) that allows users to execute transactions without paying gas fees. The Gelato Network uses it to provide [gasless transactions](#gasless-transactions) to Safe users. Safe also partnered with [Pimlico](https://pimlico.io) to develop a [Safe Module](#safe-modules) that implements this standard, allowing developers and [Safe{Wallet}](https://app.safe.global).

### EntryPoint

EntryPoint is part of the [4337 Standard](#erc-4337) and describes a smart contract deployed once per chain (a [singleton](#singleton)) to verify and execute bundles of [UserOps](#userops) sent to it. You can know more by reading the [EntryPoint](https://erc4337.io/docs/understanding-ERC-4337/entry-point-contract) section of the 4337 Standard.

### Externally Owned Accounts

An Externally Owned Account (or EOA) is one of Ethereum's two types of [accounts](https://ethereum.org/en/whitepaper/#ethereum-accounts). It represents an Ethereum address and is used to sign transactions and messages. The Ethereum white paper introduced it along with the other type of account: [smart contracts](https://ethereum.org/en/whitepaper/#scripting). The central vision of Safe is to provide safe and secure tools for users to interact with the blockchain, and moving from EOAs to [Smart Accounts](#smart-accounts) is its primary way of achieving this vision.

## F

### Function Handlers

Function handlers are a type of [module](#safe-modules) that extends the functionality of Safe{Core} by allowing Safes to respond to any instructions from arbitrary function calls. You can learn more by reading the Safe Modular Smart Account Architecture presentation [here](https://safe.mirror.xyz/t76RZPgEKdRmWNIbEzi75onWPeZrBrwbLRejuj-iPpQ).

<!-- You can know more by reading the [Function Handlers](https://docs.safe.global/safe-modules/function-handlers) section of the Safe{Core} SDK documentation. -->

## G

### Gasless Transactions

Gasless transactions (also known as meta-transactions) are [Ethereum transactions](#transactions) paid for by a third party. They can be paid for by a [relayer](#relayers) or a Safe{Wallet} user's Safe. They're used to provide a better user experience by removing the need for users to pay for gas fees or even having to buy cryptocurrency altogether when interacting with a blockchain.

## H

### Hooks

Hooks are a type of [module](#safe-modules) that allows users to perform checks or function calls before and after a Safe transaction.

## M

### Managers

Managers are a core unit constituting the [Safe{Core} Protocol](#safecore-protocol) (along with [modules](#modules) and [registries](#registries)) that allows users to manage the modules installed on a specific implementation of [account abstraction](#account-abstraction) standards.

## N

### Networks

Networks are Ethereum-based ledgers. They're used to store transactions and smart contracts. They're also used to transfer funds from one account to another or as a support to interact with smart contracts. You can find a list of supported networks by Safe{Core} Protocol [here](../safe-smart-account/supported-networks.md) and the list of the ones supported by Safe{Core} API [here](../safe-core-api/supported-networks.md).

## O

### Owners

Owners are the Ethereum addresses that control a [Safe Smart Account](#safe-smart-accounts). They can be either [EOAs](#externally-owned-account) or other [smart accounts](#safe-smart-accounts).

## P

### Plugins

Plugins are a [module](#safe-modules) that extends the functionality of Safe{Core} by adding custom features. They can be used to add support for off-chain operations interacting with a Safe through an external service or to add support for a specific smart contract.

### Paymasters

Paymasters are part of the [4337 Standard](#erc-4337) and describe a smart contract that can pay for gas fees on behalf of users. In the context of Safe, they're used to provide [gasless transactions](#gasless-transactions) to Safe users, and can be customized to follow specific business logics. You can know more by reading the [Paymasters](https://erc4337.io/docs/paymasters/introduction) section of the 4337 Standard.

## R

### Relayers

Relayers are third-party services that can pay for gas fees on behalf of users. They're used to provide [gasless transactions](#gasless-transactions) to Safe users.

### Registries

Registries are a core unit constituting the [Safe{Core} Protocol](#safecore-protocol) (along with [modules](#modules) and [managers](#managers)) that allows users to register and un-register modules on a Safe. They're used to provide a way for users to manage the modules installed on their Safes while ensuring the security of the protocol.

## S

### Safe{Core}

Safe{Core} is a set of smart contracts and Typescript packages used to build Safe{Wallet} and other open-source wallets with security and usability in mind.

### Safe{Core} API

[Safe{Core} API](../safe-core-api/service-architecture.md) is a set of REST APIs built to interact more easily with [Safe{Core} Protocol](#safecore-protocol). The [Safe{Core} SDK API Kit](../safe-core-sdk/api-kit/README.md) is a TypeScript client for this API.

### Safe{Core} SDK

Safe{Core} SDK is a Typescript library built to interact with Safe{Core} Protocol. Safe{Wallet} interacts with Safes by using it internally. You can know more by reading the [Safe{Core} SDK](https://docs.safe.global/safe-core-aa-sdk) documentation. If you are facing any issues without a solution in the documentation, you can also ask questions in [Stack Exchange](https://ethereum.stackexchange.com/questions/tagged/safe-core-sdk) using the tag `safe-core-sdk`.

### Safe{Core} Protocol

[Safe{Core} Protocol](https://docs.safe.global/safe-core-protocol/safe-core-protocol) is a set of [smart contracts](https://github.com/safe-global/safe-core-protocol) used to build [Safe Smart Accounts](#safe-smart-accounts). You can find information about why we built Safe{Core} Protocol in its original [announcement](https://safe.mirror.xyz/KiklifJINUpklBzf-usK_54EC86AfSeX5wH89bNxglM). This standard is the core of the Safe ecosystem, and Safe{Wallet} relies on it to interact with Safes via [Safe{Core} SDK Protocol Kit](https://docs.safe.global/safe-core-aa-sdk/protocol-kit), which allows developers to interact with the protocol using TypeScript. You can read more in the [protocol specifications](https://github.com/safe-global/safe-core-protocol-specs) and the [white paper](https://github.com/safe-global/safe-core-protocol-specs/blob/main/whitepaper.pdf).

{% hint style="warning" %} Safe{Core} Protocol isn't yet ready for production. For the current implementation used across Safe's ecosystem, see the [`safe-contracts`](https://github.com/safe-global/safe-contracts/tree/main) repository. {% endhint %}

### Safe{DAO}

Safe{DAO} is a decentralized autonomous organization that governs the Safe ecosystem. It manages the Safe{Core} smart contracts and parts of the Safe{RecoveryHub} process. You can know more by visiting the [Safe{DAO}](https://governance.safe.global/) governance portal.

### Safe{Wallet}

Safe{Wallet} is the official user interface to manage Safe accounts. It can sign transactions and messages and interact with other smart contracts from the web, at [app.safe.global](https://app.safe.global), or from a mobile device, using the [Safe{Wallet} mobile app](https://safe.global/wallet). It uses the Safe{Core} SDK internally. You can know more by reading our [Support Center](https://help.safe.global)'s [Safe{Wallet}](https://help.safe.global/en/collections/9801-getting-started) section.

<!-- ### Safe{RecoveryHub}

Safe{RecoveryHub} is a process used to describe recovering access to a Safe. It's a way to improve the security of Safes by enabling Safe owners to split control of their Safe with a decentralized committee selected by Safe{DAO}. You can know more by reading the [Safe Recovery](https://help.safe.global/en/articles/110656-account-recovery-with-safe-recoveryhub) guide. -->

### Safe Apps

Safe Apps are web applications that can interact with Safe. They're used to provide a better user experience when interacting with Safe and internally use the [Safe Apps SDK](../safe-apps/README.md). They can interact with Safe{Wallet} and fully utilize its main features, such as [transactions](#transactions) and [modules](#modules). The [Safe App Gallery](https://app.safe.global/apps) displays all the Apps that any Safe{Wallet} user can use.

### SafeAuth

SafeAuth is a part of the [Safe{Core} SDK Auth Kit](https://docs.safe.global/safe-core-aa-sdk/auth-kit) that provides tools to authenticate users with one of the different [Social Login](#social-login) methods offered, thanks to our integration with [Web3Auth](https://web3auth.io/) generating an externally owned account that can act as a [Safe Smart Account](#safe-smart-accounts) signer. You can know more by reading the [Safe Auth](https://docs.safe.global/safe-core-aa-sdk/auth-kit/guides/safe-auth) guide.

### Safe Guards

Guards are smart contracts that can protect Safe transactions. They're used to add an extra layer of security to Safe transactions by adding custom rules to them before or after a transaction. For example, a guard can protect a Safe transaction from being executed if a specific user doesn't sign the transaction.

### Safe Modules

[Safe Modules](https://docs.safe.global/safe-smart-account/modules) are the core units constituting the [Safe{Core} Protocol](#safecore-protocol). They come in four types: [Function Handlers](#function-handlers), [Hooks](#hooks), [Plugins](#plugins), and [Signature Verifiers](#signature-verifiers). They're used to extend the functionality of Safe{Core} by adding custom features and business logic in a secured way, while avoiding any type of vendor lock-in. The protocol ensures the security of modules through [registries](#registries), and that it remains vendor agnostic by encapsulating different [account abstraction](#account-abstraction) implementations through a [manager](#managers).

### Safe Smart Accounts

Smart Accounts (sometimes known as Smart Contract Wallets, Smart Wallets, or Contract Wallets) are a way to improve the security of Ethereum [Externally Owned Accounts](#externally-owned-account) by adding a layer of abstraction on top of them, adding features for recovery, [social logins](#social-login), and [gasless transactions](#gasless-transactions). They're [smart contracts](https://ethereum.org/en/whitepaper/#scripting) used to store funds and execute transactions on behalf of their owners. In Safe's context, Safe Smart Accounts are any implementation of the [`safe-contracts`]() repository. This abstraction layer is our central concept for building [Safe's vision](https://docs.safe.global/safe-smart-account/safe-smart-account).

### Singleton

Singleton is a term used to describe a smart contract that can only be deployed once. In the context of Safe, it describes the [Safe{Core} Proxy](https://github.com/safe-global/safe-contracts/blob/main/contracts/proxies/SafeProxy.sol) smart contract deployed once on each [supported network](../safe-smart-account/supported-networks.md) so that all future Safes deployed on these networks can delegate transactions and function calls to it.

### Signature verifiers

Signature verifiers are a type of [module](#safe-modules) that allows users to verify [EIP-1271](#eip-1271) signatures on Safe transactions. It offers developers greater flexibility to define the verification logic of their choice.

## T

### Transactions

Transactions are what change the state of Ethereum-based ledgers. They're used to transfer funds from one account to another or to interact with smart contracts. You can learn more about how Safe{Wallet} handles transactions by reading the [Transactions](https://help.safe.global/en/collections/9814-transactions) section of our [Support Center](https://help.safe.global).

### Threshold

Threshold is a term used to describe the number of signatures required to execute a Safe transaction. It's used to improve the security of Safes by requiring multiple signatures to execute a transaction. You can know more by reading the [`getThreshold`](https://docs.safe.global/safe-core-aa-sdk/protocol-kit/reference#getthreshold) and [`createChangeThresholdTx`](https://docs.safe.global/safe-core-aa-sdk/protocol-kit/reference#createchangethresholdtx) sections of the [Safe{Core} SDK](#safecore-sdk) [Protocol Kit](https://docs.safe.global/safe-core-aa-sdk/protocol-kit) [reference](https://docs.safe.global/safe-core-aa-sdk/protocol-kit/reference).

## U

### UserOps

UserOps is part of the [4337 Standard](#erc-4337) and describes an object ("pseudo-transaction") representing a transaction that can be executed without paying gas fees. Dapps usually create them, and wallets (not only Safe{Wallet}) should be able to translate them into regular transactions and execute them. You can know more by reading the [UserOps](https://erc4337.io/docs/understanding-ERC-4337/user-operation) section of the 4337 Standard.

## W

### Wallet

A wallet is a piece of software used to manage Ethereum accounts. It can sign transactions and messages and interact with smart contracts.

<!-- ### WalletConnect

WalletConnect is a protocol for connecting decentralized applications to mobile wallets with QR code scanning or deep linking. It can link Safe{Wallet} to other decentralized applications. You can follow [this guide](https://help.safe.global/en/articles/108235-how-to-connect-a-safe-to-a-dapp-using-walletconnect) to know more. -->
