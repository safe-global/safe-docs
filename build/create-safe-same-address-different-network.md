# How to Create a Safe with the Same Address on a Different Network

This guide will show you how to recreate a Safe with a specific address on a  different network. This is useful for recovering funds sent to a Safe that exists on one network but not another. This is is an issue that many users have faced ([example 1](https://ethereum.stackexchange.com/questions/141408/sent-usdc-to-wrong-chain-on-gnosis-need-to-recover), [example 2](https://ethereum.stackexchange.com/questions/129309/create-a-safe-with-the-same-address-on-the-bsc-chain), [example 3](https://ethereum.stackexchange.com/questions/127353/trying-to-recreate-a-safe-from-mainnet-into-gnosis-chain-issue)[more examples](https://ethereum.stackexchange.com/search?q=%5Bgnosis-safe%5D+wrong+chain)).

For example, consider the following:

1. Safe is deployed at address [`0xF188` on Goerli](https://app.safe.global/home?safe=gor:0xF188d41FD181f94960C5451D7ff6FdbcDf201a71) in transaction
2. User accidentally sends some Optimism ETH to the address [`0xF188` on Optimism](https://optimistic.etherscan.io/address/0xF188d41FD181f94960C5451D7ff6FdbcDf201a71) in [transaction `0x975f`](https://optimistic.etherscan.io/tx/0x975f81407a2b7dfdd5c73220a920f327e379fd5d03c0175a106640451d7790a6)
3. There is no Smart Contract at that address, so those funds are currently locked
4. Recreate a Safe with address `0xF1881` on Optimism and recover the funds 


## Pre-requisites

1. A Signing Account/EOA with crypto to pay the gas fees

1. This tutorial works for contracts created with `createProxyWithNonce` (version 1.3.0 and higher) and is on a [network with the same address for Safe Proxy Fractory, `0xa6B`](https://blockscan.com/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2). Here are a [list of all the diffeent contract addresses where the Proxy Factory is deployed](https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/proxy_factory.json). You will notice that most of them either start with either `0xa6B7` or `0xC228`. The original network and recovery network must have the same address.

1. Make sure to check that the implementation contract also exists.
    1. If the implementation contract does not exist, the call will succeed, and people will think it was deployed but it won't work

`createProxyWithNonce` is similar to `CREATE2`
TODO: confirm if the above is true, briefly explain create2 and link to a relevant resource

1. If you are recreating a Safe created on Ethereum's Mainnet, the Safe will be created but it won't show up on the Safe UI. You will have to load it using another tool like the Safe See Appendix. [Recreating a Safe from Ethereum Mainnet](#recreating-a-safe-from-ethereum-mainnet) for more information.


## Considerations

TODO: what are the edge cases to be aware of when creating a Safe on different addresse?

Recreating mainnet Safe's does not emit events. So it won't show up on Safe UI.

## Use Metamask

The easiest way to recover your Safe is by using Metamask. 

See also: [Recreating a Rinkeby Safe on Polygon](https://www.loom.com/share/ca34aabcd62747fb9fb89bd463b4c741)

## Part 2: Recreating Safe with Safe CLI

TODO

## Part 3: Recreating Safe with Safe {Core} SDK

TODO

## Resources

- [Hackathon project that created a Safe with same address on many networks](https://ethglobal.com/showcase/many-safes-2otg1)
- [Article about Optimism Wintermute Hack](https://foresightnews.pro/article/detail/10296): A hacker used a very similar technique to take some money from Optimism.

## Appendix

### Recreating a Safe from Ethereum Mainnet

If you recreate a Safe that was originally created on Ethereum Mainnet not another chain, it won't show up in the UI.

This is because Safe Contracts on Ethereum Mainnet are created with `Safe.sol` while other chains use `Safe_l2.sol`. The difference is that `Safe.sol` does not emit events in order to save gas fees. While `Safe_l2.sol` emits events. The Safe Transaction servie listens to emitted events to know what transactions occured in a Safe. While on Ethereum Mainnet, transaction logs are recreated using a process called tracing that recreates the transaction using the bytecode. 

So when you recreate a Safe that was created on Ethereum mainnet on another chain, because you are replaying the transaction, it will call `Safe.sol` on the new chain which means that it won't emit an event and because the Transaction service for this other chain is only listening for events and not tracing, the Safe transaction service won't know that a transaction was made to or from that Safe.