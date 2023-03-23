# How to Create a Safe with the Same Address on a Different Network to Recover Funds

This guide will show you how to recreate a Safe with a specific address on a different network. This is useful for recovering funds sent to a Safe that exists on one network but not another. This is is an issue that [many](https://ethereum.stackexchange.com/questions/141408/sent-usdc-to-wrong-chain-on-gnosis-need-to-recover) [users](https://ethereum.stackexchange.com/questions/129309/create-a-safe-with-the-same-address-on-the-bsc-chain) [have](https://ethereum.stackexchange.com/questions/127353/trying-to-recreate-a-safe-from-mainnet-into-gnosis-chain-issue) [faced](https://ethereum.stackexchange.com/search?q=%5Bgnosis-safe%5D+wrong+chain).

Note: The goal of deploying the same Safe address on different chains is to recover locked funds. We don't recommend using this method as a default way of having the same address on different chains. See [Account Abstraction in a Multichain Landscape - Part 1: Addresses](https://safe.mirror.xyz/4GcGAOFno-suTCjBewiYH4k4yXPDdIukC5woO5Bjc4w).

## Resources
- [Loom video showing how to recreate a Safe originally deployed to Rinkeby on Polygon](https://www.loom.com/share/ca34aabcd62747fb9fb89bd463b4c741)
- For older Safe versions: [I sent assets to a Safe address on the wrong network, any chance to recover?](https://help.safe.global/en/articles/5267779-i-sent-assets-to-a-safe-address-on-the-wrong-network-any-chance-to-recover)

For example, consider the following:

1. Safe is deployed at address [`0xF188` on Goerli](https://app.safe.global/home?safe=gor:0xF188d41FD181f94960C5451D7ff6FdbcDf201a71) in transaction
2. User accidentally sends some Optimism ETH to the address [`0xF188` on Optimism](https://optimistic.etherscan.io/address/0xF188d41FD181f94960C5451D7ff6FdbcDf201a71) in [transaction `0x975f`](https://optimistic.etherscan.io/tx/0x975f81407a2b7dfdd5c73220a920f327e379fd5d03c0175a106640451d7790a6)
3. There is no Smart Contract at that address, so those funds are currently locked
4. Recreate a Safe ([transaction `0x58d2`](https://optimistic.etherscan.io/tx/0x58d2e8d75f3d02fc4588fe2c50e44a51d98738916771b823e09876328bff3f77)) with address `0xF1881` on Optimism and recover the funds 


## Pre-requisites

1. Access to the same Signing Account/EOA that created the Safe on the original chain

1. The Signing Account should have enough crypto to pay the gas fees on the recovery chain

1. This tutorial works for contracts created with `createProxyWithNonce` (version 1.3.0 and higher) and is on a [network with the same address for Safe Proxy Fractory, `0xa6B`](https://blockscan.com/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2). Here are a [list of all the diffeent contract addresses where the Proxy Factory is deployed](https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/proxy_factory.json). You will notice that most of them either start with either `0xa6B7` or `0xC228`. The original network and recovery network must have the same address.

1. The implementation contract exists at the same address on both chains
    1. If the implementation contract does not exist, the call will misleadningly still succeed. You might think this means the 

1. If you are recreating a Safe created on Ethereum's Mainnet, the Safe will be created but it won't show up on the Safe UI. You will have to load it using another tool like the Safe See Appendix. [Recreating a Safe from Ethereum Mainnet](#recreating-a-safe-from-ethereum-mainnet) for more information.

## Use Metamask

The easiest way to recover your Safe is by using Metamask.

See also: [Recreating a Rinkeby Safe on Polygon](https://www.loom.com/share/ca34aabcd62747fb9fb89bd463b4c741)

### Enable Show Hex Data in Metamask
![Screen Shot 2023-03-17 at 4 00 39 PM](https://user-images.githubusercontent.com/9806858/226020125-788ae92c-9f98-486a-89fb-45e88da179ec.png)

### Add Network

![Screen Shot 2023-03-17 at 4 00 53 PM](https://user-images.githubusercontent.com/9806858/226020214-56e5e9c2-9b7f-4cd0-b5e5-a21c73f91d88.png)

### Verify [Proxy Factory has the same address on Both Chains](https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/proxy_factory.json)
![Screen Shot 2023-03-17 at 4 08 07 PM](https://user-images.githubusercontent.com/9806858/226023682-4855ce25-129d-47b1-9f24-3b74a12852fb.png)

### Alternate: Check the [List of deployed Proxy Factory Addresses on Other Chains](https://blockscan.com/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2)

![Screen Shot 2023-03-23 at 7 34 31 AM](https://user-images.githubusercontent.com/9806858/227191742-60aaab59-be71-4d8f-9f21-1a57d1910e0c.png)


### Get [Transaction Creation Data](https://app.safe.global/transactions/history?safe=gor:0xF188d41FD181f94960C5451D7ff6FdbcDf201a71)

![Screen Shot 2023-03-23 at 7 33 48 AM](https://user-images.githubusercontent.com/9806858/227191393-21843e91-0ac5-457c-9133-6a6d317ef8aa.png)


### Copy Safe Contract Creation Data

![Screen Shot 2023-03-17 at 4 06 53 PM](https://user-images.githubusercontent.com/9806858/226022160-2907617e-6283-41c1-bc97-ccd90d8ff9ef.png)

### Paste Proxy Factory and Transaction Hex into Metamask

![Screen Shot 2023-03-17 at 4 04 08 PM](https://user-images.githubusercontent.com/9806858/226022325-4be63630-9476-4d4e-aef7-498966f3bfa8.png)


## Part 3: Recreating Safe with Safe {Core} SDK

See the code snippet in [`recreateSafe.ts`](/examples/utils/recreateSafe.ts). 

## Appendix

### How it Works

Safes are created by calling [`createProxyWithNonce` which uses `CREATE2`](https://github.com/safe-global/safe-contracts/blob/ba526d0475e3004f9fcd71cd25ebbd225ebeee7f/contracts/proxies/SafeProxyFactory.sol#L32)

The [CREATE2 opcode](https://eips.ethereum.org/EIPS/eip-1014) gives you the ability to predict the address where a contract will be deployed, without deploying it. See [Deploying Smart Contracts Using CREATE2](https://docs.openzeppelin.com/cli/2.8/deploying-with-create2) for more information about this.

### Recreating a Safe from Ethereum Mainnet

If you recreate a Safe that was originally created on Ethereum Mainnet not another chain, it won't show up in the UI.

This is because Safe Contracts on Ethereum Mainnet are created with `Safe.sol` while other chains use `Safe_l2.sol`. The difference is that `Safe.sol` does not emit events in order to save gas fees. While `Safe_l2.sol` emits events. The Safe Transaction servie listens to emitted events to know what transactions occured in a Safe. While on Ethereum Mainnet, transaction logs are recreated using a process called tracing that recreates the transaction using the bytecode. 

So when you recreate a Safe that was created on Ethereum mainnet on another chain, because you are replaying the transaction, it will call `Safe.sol` on the new chain which means that it won't emit an event and because the Transaction service for this other chain is only listening for events and not tracing, the Safe transaction service won't know that a transaction was made to or from that Safe.
