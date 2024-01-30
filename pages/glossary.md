# Glossary

This glossary contains terms and definitions used throughout the Safe documentation.

## Account Abstraction

Account Abstraction is a new paradigm that focuses on improving the user experience when interacting with the blockchain by replacing the use of [externally-owned accounts](#externally-owned-account) with [smart accounts](#smart-account).

Some Account Abstraction features are:
- Elimination of seed phrase reliance
- Ease of multichain interactions
- Account recovery
- [Gasless transactions](#gasless-transaction)
- Transaction batching

See also:
- [Account Abstraction](https://ethereum.org/en/roadmap/account-abstraction) on ethereum.org
- [EIP-4337: Account Abstraction](https://www.erc4337.io) on erc4337.io

## EIP-1271

The [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) is an [Ethereum Improvement Proposal](https://eips.ethereum.org) that proposes a standard way for any contract to verify whether a signature on behalf of a given contract is valid. This is possible via the implementation of a `isValidSignature(hash, signature)` function on the signing contract, which can be called to validate a signature.

## EIP-712

The [EIP-712](https://eips.ethereum.org/EIPS/eip-712) is an Ethereum Improvement Proposal that proposes a standard for hashing and signing of typed structured data instead of just bytestrings.

## ERC-4337

The [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) is an [Ethereum Request for Comments](https://eips.ethereum.org/erc) that introduces a higher-layer pseudo-transaction object called `UserOperation`. Users send `UserOperation` objects into a separate mempool. A special class of actor called bundlers package up a set of these objects into a transaction making a `handleOps` call to a special contract, and that transaction then gets included in a block.

See also:
- [ERC-4337 Documentation](https://www.erc4337.io) on erc4337.io

## Externally-Owned Account

An externally-owned account (also known as EOA) is one of the two types of Ethereum accounts. A private key controls it; it has no code, and users can send messages by creating and signing Ethereum transactions.

See also:
- [Ethereum Accounts](https://ethereum.org/en/developers/docs/accounts) on ethereum.org
- [Ethereum Whitepaper](https://ethereum.org/en/whitepaper/#ethereum-accounts) on ethereum.org

## Gasless Transaction

Gasless transactions (also known as meta-transactions) are Ethereum transactions that are executed by a third party called [relayer](#relayer) on behalf of a [smart account](#smart-account) to abstract the use of gas. Users must sign a message (instead of the transaction itself) with information about the transaction they want to execute. A relayer will create the Ethereum transaction, sign and execute it, and pay for the gas costs. The main benefit is that users can interact with the blockchain without holding the native token in their account.

See also:
- [Relay Kit documentation](./sdk-relay-kit) on docs.safe.global

## Network

A blockchain network is a collection of interconnected computers that utilize a blockchain protocol for communication. Decentralized networks allow users to send transactions, that are processed on a distributed ledger with a consensus mechanism ensuring the batching, verification, and acceptance of data into blocks. This structure enables the development of applications without the need for a central authority or server.

See also:
- [Networks](https://ethereum.org/en/developers/docs/networks) on ethereum.org

## Owner

A Safe owner is one of the accounts that control a given Safe. Only owners can manage the configuration of a Safe and approve transactions. They can be either [externally-owned accounts](#externally-owned-account) or [smart accounts](#smart-account). The [threshold](#threshold) of a Safe defines how many owners need to approve a Safe transaction to make it executable.

See also:
- [OwnerManager.sol](https://github.com/safe-global/safe-smart-account/blob/main/contracts/base/OwnerManager.sol) on github.com

## Relayer

A relayer is a third-party service acting as an intermediary between users' accounts and [blockchain networks](#network). It executes transactions on behalf of users and covers the associated execution costs, which may or may not be claimed.

See also:
- [What's Relaying?](https://docs.gelato.network/developer-services/relay/what-is-relaying) on docs.gelato.network

## Safe{DAO}

The Safe{DAO} is the [Decentralized Autonomous Organization](https://ethereum.org/dao) (DAO) that aims to foster a vibrant ecosystem of applications and wallets leveraging Safe accounts. This will be achieved through data-backed discussions, grants, and ecosystem investments, as well as providing developer tools and infrastructure.

See also:
- [Safe{DAO} Forum](https://forum.safe.global)
- [Safe{DAO} Governance process](https://forum.safe.global/t/how-to-safedao-governance-process/846) on forum.safe.global
- [Safe{DAO} Proposals](https://snapshot.org/#/safe.eth) on snapshot.org

## Safe{Wallet}

[Safe{Wallet}](https://app.safe.global) is the official user interface to manage Safe accounts.

See also:
- [Getting Started with Safe{Wallet}](https://help.safe.global/en/collections/9801-getting-started) on help.safe.global

## Safe Apps

Safe Apps are web applications that run in the Safe Apps marketplace. They support Safe, use the Safe Apps SDK to interact with it, and aren't owned, controlled, maintained, or audited by Safe.

See also:
- [Safe Apps SDK documentation](./apps-sdk-overview.md) on docs.safe.global

## SafeAuth

SafeAuth is a Multi-Party Computation (MPC) based product developed by [Safe](https://safe.global) and [Web3Auth](https://web3auth.io). Compatible with [Safe{Wallet}](https://app.safe.global), SafeAuth allows developers to build portable smart account use cases. Users are empowered to plug and play their user accounts between different decentralized applications through their social login.

See also:
- [SafeAuth documentation](./sdk-auth-kit/guides/safe-auth.md) on docs.safe.global
- [SafeAuth demo app](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit/example) on github.com
- [Safe + Web3Auth = SafeAuth: Portable Safe Accounts with social login](https://safe.mirror.xyz/WKxK5FENvkT8BjpowJQAhokYzb22438zUCG3wUSWvjc) on safe.mirror.xyz

## Safe Guard

A Safe Guard is a smart contract that adds restrictions on top of the n-out-of-m scheme that Safe accounts offer. They make checks before and after the execution of a Safe transaction.

See also:
- [Safe Guards documentation](./smart-account-guards.md) on docs.safe.global
- [Zodiac Guards](https://zodiac.wiki/index.php?title=Category:Guards) on zodiac.wiki
- [Get the enabled Safe Guard](./sdk-protocol-kit/reference.md#getguard) and [enable a Safe Guard](./sdk-protocol-kit/reference.md#createenableguardtx) with the Safe{Core} SDK on docs.safe.global

## Safe Module

A Safe Module is a smart contract that adds functionality to Safe while separating module logic from Safe core contracts.

See also:
- [Safe Modules documentation](./smart-account-modules.md) on docs.safe.global
- [Safe Modules repository](https://github.com/safe-global/safe-modules) on github.com
- [Zodiac Modules](https://zodiac.wiki/index.php?title=Category:Module) on zodiac.wiki
- [Get the enabled Safe Modules](./sdk-protocol-kit/reference.md#getmodules) and [enable a Safe Module](./sdk-protocol-kit/reference.md#createenablemoduletx) with the Safe{Core} SDK on docs.safe.global

## Smart Account

A smart account (also known as a smart contract account) leverages the programmability of smart contracts to extend its functionality and improve its security in comparison with [externally-owned accounts](#externally-owned-account). Smart accounts are controlled by one or multiple externally-owned accounts or other smart accounts, and all transactions have to be initiated by one of those.

Some common features that smart accounts offer to their users are:
- Multisignature scheme
- Transaction batching
- Account recovery
- [Gasless transactions](#gasless-transaction)

Safe is one of the most trusted implementations of a smart account.

## Transaction

A transaction is an action initiated by an [externally-owned account](#externally-owned-account) to update the state of the EVM network. Transaction objects must be signed using the sender's private key, require a fee, and be included in a validated block.

A Safe transaction is a transaction sent to a Safe Proxy contract calling the [execTransaction](https://github.com/safe-global/safe-smart-account/blob/main/contracts/Safe.sol#L104) method.

See also:
- [Transactions](https://ethereum.org/developers/docs/transactions) on ethereum.org

## Threshold

The threshold of a Safe account is a crucial configuration element that enables using Safe as a multi-signature smart account. It defines the number of required confirmations from the Safe owners a (Safe) transaction must have to be executable.

See also:
- [Get the threshold](./sdk-protocol-kit/reference.md#getthreshold) and [change the threshold](./sdk-protocol-kit/reference.md#createchangethresholdtx) of a Safe with the Safe{Core} SDK on docs.safe.global

## Wallet

A wallet is an interface or application that gives users control over their blockchain account. Wallets allow users to sign in to applications, read their account balance, send transactions, and verify their identity.

See also:
- [Ethereum Wallets](https://ethereum.org/wallets) on ethereum.org
