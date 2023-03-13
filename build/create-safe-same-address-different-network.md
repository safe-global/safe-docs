# How to Create a Safe with the Same Address on a Different Network

This guide will show you how to create a Safe with a specific address and recover funds sent to a Safe that exists on one network but not another. This is is an issue that many users have faced ([example 1](https://ethereum.stackexchange.com/questions/141408/sent-usdc-to-wrong-chain-on-gnosis-need-to-recover), [example 2](https://ethereum.stackexchange.com/questions/129309/create-a-safe-with-the-same-address-on-the-bsc-chain))[ TODO find [more examples](https://ethereum.stackexchange.com/search?q=%5Bgnosis-safe%5D+wrong+chain)].

For example, consider the following:

1. Safe is deployed at address [`0xF188` on Goerli](https://app.safe.global/home?safe=gor:0xF188d41FD181f94960C5451D7ff6FdbcDf201a71) in transaction
2. User accidentally sends some Optimism ETH to the address [`0xF188` on Optimism](https://optimistic.etherscan.io/address/0xF188d41FD181f94960C5451D7ff6FdbcDf201a71)
3. There is no Signing Account (EOA) or Smart Contract at that address, so those funds are currently locked
4. Recreate a Safe with address `0xF1881` on Optimism and recover the funds 


## Pre-requisites

1. This tutorial works for contracts created with `createProxyWithNonce` (version 1.3.0 and higher)[TODO: confirm if true] and is on a [network with the same address for Safe Proxy Fractory, `0xa6B`](https://blockscan.com/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2). 

1. Make sure to check that the implementation contract also exists.
    1. If the implementation contract does not exist, the call will succeed, and people think it was deployed but it won't work

`createProxyWithNonce` is similar to `CREATE2`
TODO: confirm if the above is true, briefly explain create2 and link to a relevant resource

1. You will need an EOA with gas fees

## Considerations

TODO: what are the edge cases to be aware of when creating a Safe on different addresse?

Recreating mainnet Safe's does not emit events. So it won't show up on Safe UI.

So the Safe will show up in the UI but the transactions to and from the Safe UI won't show up.

It uses a feature called tracing and look at low-level opcodes to figure out what happened.

Backend is not listening Safe mainnet contract interactions deployed on sidechain.

- Safe on mainnet, deployed to Optimism
- THis Safe will use the Safe.sol Optimism contract, not SafeL2.sol
- But if we had created the Safe using the UI, then it would have used the Safel2 contract
- Safe.sol doens't emit events, because it was intended to be used on mainent
- Emtting events uses gas, because it was so expensive, Safe.sol does not emit events
- Instead it uses a thing called tracing, that reads the low-level opcodes to recreate that it was a send send 10 ETH to this address
- Tracing has very node requirements, very slow, replaying the transaction
- Doing tracing on chains with very high throughput it's hard to synchronize
- Replay 100s of transactions every few seconds

- Polygon and Binance don't have good support for tracing nodes, put such a high requirement for nodes required, tracing is not easy for them
- No economic incentive to use tracing

- Question of how often does this happen?
- How often are people sending

- If Safe wanted to, we could use tracing on chains with high throughput 
    - We would need a node that supports tracing


- Redeploying a Safe on a new network, deploys it with the same settings ast he original Safe had when it was created

- The address of ad eployed contract, is a hash of the creator of a contract and hash of deployment data, owner addres, threshold, modules

- Ouput hash is the variable of the address

## Use Metamask Raw Transaction

todo: mention Mikhail's Loom video

Include checking that the Safe implementation address is deployed.

## Part 1: Use Etherscan UI


First, get the parameters used for `createProxywithNonce` from the transaction that created the Safe ([`0xe090` in this example](https://goerli.etherscan.io/tx/0xe0903aebab87bfbe40e8cf25581eaf60c42c347136bdeddf79fe5a64878ba72e)).

You can find this from [Transactions history in Safe {Wallet} UI](https://app.safe.global/transactions/history?safe=gor:0xF188d41FD181f94960C5451D7ff6FdbcDf201a71) or the [first internal transaction in your block explorer](https://goerli.etherscan.io/address/0xF188d41FD181f94960C5451D7ff6FdbcDf201a71#internaltx).

[todo: picture of transaction parmeters]



### Get Safe Creation Transaction Parameters

1. Click on More Details
2. Click on Decode Input Data
3. Copy the parameters to a clipboard

For our example:

```txt
0	_singleton	address	0x3E5c63644E683549055b9Be8653de26E0B4CD36E
1	initializer	bytes	0xb63e800d000[truncated for brevity]
2	saltNonce	uint256	1677334598968770
```
[TODO: Does the Nonce have to be incremental -> How can the Nonce's match]

### Rerun Safe Creation Transaction Parameters on new Chain

1. Go to the Safe Proxy Factory 1.3.0 for the contract on the chain we are trying to recover. Here is a [list of network with the same address for Safe Proxy Fractory 1.3.0 `0xa6B`](https://blockscan.com/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2)

    1. Here is the [contract page for Optimism](https://optimistic.etherscan.io/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2).

1. Go to [Write Contract](https://optimistic.etherscan.io/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2#writeContract)

1. Connect to Web3

1. Open `calculateCreateProxyWithNonceAddress`

1. Add the parameters from Get Safe Creation Transaction Parameters and click "Write"

1. Confirm that the result matches the Safe address you want. In this example, it should start with `0xF188`

1. If you get the desired address:
    1. click `calculateCreateProxyWithNonceAddress` -> You can recreate this with keccak hash
    1. Enter the same parameters from the last step
    1. Click Write

Then you should have the Safe recreated on the new network

## Part 2: Recreating Safe with Safe CLI

TODO

## Part 3: Recreating Safe with Safe {Core} SDK

TODO

## Resources

- [Hackathon project that created a Safe with same address on many networks](https://ethglobal.com/showcase/many-safes-2otg1)
- [Article about Optimism Wintermute Hack](https://foresightnews.pro/article/detail/10296): A hacker used a very similar technique to take some money from Optimism.
- [https://etherscan.io/tx/0x3515ec679b21fc6f498ff8611fa7340dd59463dfc98d55110dce8e8066aaf2cb](https://etherscan.io/tx/0x3515ec679b21fc6f498ff8611fa7340dd59463dfc98d55110dce8e8066aaf2cb)
- `createProxyWithNonce`
