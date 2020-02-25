---
id: introduction4
title: Overview of Safe contracts
sidebar_label: Overview of Safe contracts
---

## 1. Transaction management (Core contract)
https://github.com/gnosis/safe-contracts/blob/development/contracts/GnosisSafe.sol 
This contract contains all core functionality required to setup a Gnosis Safe and to execute transactions. It contains the logic to use the optional token payment feature. Events are emitted for every successful as well as every failed transaction.


## 2. Owner management
https://github.com/gnosis/safe-contracts/blob/development/contracts/base/OwnerManager.sol

One core feature of a multi-signature wallet is to be operated by multiple accounts known as owners. OwnerManager.sol allows you to add, remove, and replace owners. Furthermore, a threshold number of owners required to confirm a transaction for it to be executed can be specified and modified. You can retrieve the list of owners. Events are emitted every time an owner is added or removed as well as whenever the threshold changes.


## 3.Module management
https://github.com/gnosis/safe-contracts/blob/development/contracts/base/ModuleManager.sol

Modules add additional functionalities to the Gnosis Safe contracts. They are smart contracts which implement the Safe’s functionality, while separating module logic from the Safe’s core contract. Depending on the use case, modules could for instance allow the execution of transactions without requiring all confirmation. A basic Safe does not require any modules. Adding and removing a module requires confirmation from all owners. Modules are very security-critical, so they need to be as secure as all other Safe contracts. Events are emitted whenever a module is added or removed and also whenever a module transaction was successful or failed. 

Modules can include daily spending allowances,amounts that can be spent without the approval of other owners, recurring transactions modules, standing orders that are performed on a recurring set date, e.g. paying your rent, and social recovery modules, which may allow you to recover a Safe in case access to owner accounts was lost. This is just a short example list of possible modules, and one can think of many other modules that could be beneficial to your wallet. Modules enable developers to include their own features via a separate smart contract. 


## 4.Proxy 
https://github.com/gnosis/safe-contracts/blob/development/contracts/proxies/GnosisSafeProxy.sol 

Deploying the Safe contracts to the blockchain is quite costly in gas. By applying the popular [proxy pattern](https://blog.openzeppelin.com/proxy-patterns/), the costs are tremendously lowered. All Safe logic is implemented in a mastercopy which is deployed once, and therefore, creating a new Safe requires deploying a proxy contract. This proxy forwards all calls to the mastercopy for execution. Address and storage are all part of the proxy, whereas all logic is implemented in the mastercopy. This means proxies can be kept lightweight compared to the mastercopy, thereby making them cheaper to deploy. 
The mastercopy which a proxy uses can be changed, which means the core Safe logic is still upgradeable. Upgrading requires a transaction that is confirmed by all owners of a Safe. 

## 5.Proxy factory
https://github.com/gnosis/safe-contracts/blob/development/contracts/proxies/GnosisSafeProxyFactory.sol 
The proxy factory provides a simple way to create a new proxy contract pointing to a mastercopy and executing a function in the newly deployed proxy all in one transaction. This additional transaction is generally used to execute the setup function to initialize the state of the contract.


## 6.Fallback manager
https://github.com/gnosis/safe-contracts/blob/development/contracts/base/FallbackManager.sol

Ethereum fallback functions are executed when a called function signature does not match any defined function. Certain use cases require those fallback functions to contain some logic. This is for instance required for making the Safe 100% compatible with the ERC721 token standard. We provide a basic fallback manager with the basic logic set. 


A recap that looks deeper into the advantages of the Safe contracts can be found here: 
<figure class="video_container">
<iframe width="560" height="315" src="https://slideslive.com/38911778/gnosis-safe-make-dealing-with-crypto-a-less-scary-thing" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 
</figure>


