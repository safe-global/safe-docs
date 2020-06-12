---
id: intro_interfaces
title: Gnosis Safe interfaces
sidebar_label: Gnosis Safe interfaces
---

The Gnosis Safe smart contracts can be accessed via different interfaces:

## Gnosis Safe Multisig web interface

You can setup a Safe at https://gnosis-safe.io in [60 seconds](https://twitter.com/econoar/status/1194731123340763136?s=20). You specify the number of owners and their owner account addresses. Compatible account addresses include hardware wallets, Metamask, Authereum, WalletConnect enabled wallets, and others. You can see the asset overview and can make transactions such as custom transactions for direct smart contract interaction. ENS names are supported. We are working on a better dapp integration via Safe apps which third party developers can leverage. Please open an issue on [Github](https://github.com/gnosis/safe-react/issues/) for every feature request you have, and also for every bug you encounter. A testnet version is available at https://rinkeby.gnosis-safe.io/. A downloadable standalone desktop version is available [here](https://github.com/gnosis/safe-react/releases).

## Gnosis Safe mobile clients

The Gnosis Safe is the first smart contract-based Ethereum wallet on mobile. As a contract wallet, the Gnosis Safe has a wide range of functionalities that are often not possible with traditional crypto and blockchain wallets. It is always for [Android](https://play.google.com/store/apps/details?id=pm.gnosis.heimdall) and [iOS](https://apps.apple.com/app/gnosis-safe-smart-wallet/id1447390375).

This version of the Gnosis Safe targets primarily users who currently hold crypto on centralized exchanges and are looking for more secure ways to store their funds. All user flows and screens are designed to only reveal the necessary technical details, and hide complex concepts such as gas limit, gas price, or private keys. The user does not need to hold ETH anywhere else than inside the Safe to make a transaction, and there’s no need to select a gas price, limit, or the connecting node. It is our aim to provide everyone regardless of their experience level with a seamless and straight-forward user experience. Please checkout our open source repositories on Github for [Android](https://github.com/gnosis/safe-android/) and [iOS](https://github.com/gnosis/safe-ios/).

_Please note that we are currently reworking our mobile apps completely._

## Gnosis Safe command line interface (CLI)

You can use the [safe-cli](https://github.com/gnosis/safe-cli/) to interact with your Safe using the command line. Its functionality is currently limited. We will be adding more in the future. Please open an issue on [Github](https://github.com/gnosis/safe-cli/issues/) for feature requests and bugs.

## Focus on open source

All our code is open source. That includes the smart contracts, all our interfaces, and the backend services. We believe this is necessary for trust and security, especially for wallet infrastructure. You can inspect all projects on [Github](https://github.com/gnosis?q=safe).

## External interfaces

[Universal Login](https://medium.com/universal-ethereum/universal-login-beta-3-gnosis-safe-support-more-9b72be0e01f8) enables full support for Gnosis Safe smart contracts. A newly deployed wallet is by default a Gnosis Safe. They leverage the Safe mainly due to its security: “Gnosis Safe is formally verified and audited code that is storing more and more value every month (currently almost $9 million worth)”

[Pepo](https://blog.gnosis.pm/network-effects-gnosis-safe-and-pepo-the-new-dapp-for-the-crypto-community-3b8160e62898), a video-sharing social network built on blockchain and developed by OST, utilized the Gnosis Safe smart contracts. For each new Pepo user, a new Gnosis Safe contract is deployed. The Pepo team decided to build on the Gnosis Safe stack because of its modularity, flexibility, and security, allowing their dapp to take advantage of session keys, multiple device management, and account recovery. A key contribution from Gnosis Safe to the dapp’s user experience is that its contracts enable users to have multiple devices.