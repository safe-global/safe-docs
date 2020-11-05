---
id: cpktutorial5
title: Using CPK instance to invest DAI into Compound
sidebar_label: Using CPK instance to invest DAI into Compound
---

First, we need to fund the proxy with the amount of DAI we want to invest:

```jsx
await dai.methods.transfer(cpk.address, daiAmount).send({ from: address })
```

Second, we need to prepare an array of transactions to execute for the Contract Proxy Kit:

```jsx
const txs = [
  {
    operation: CPK.Call,
    to: DAI_ADDRESS,
    value: 0,
    data: dai.methods.approve(CDAI_ADDRESS, daiAmount).encodeABI()
  },
  {
    operation: CPK.Call,
    to: CDAI_ADDRESS,
    value: 0,
    data: cDai.methods.mint(daiAmount).encodeABI()
  }
]
```

And then we simply execute it by calling `execTransactions` on the CPK instance:

```jsx
await cpk.execTransactions(txs)
```

`execTransactions` will return an object with [promiEvent](https://web3js.readthedocs.io/en/v1.2.5/callbacks-promises-events.html#promievent) property you can use to subscribe for updates.

The source code of the complete example app can be found [here](https://github.com/gnosis/cpk-compound-example)

## Useful links

- [Contract Proxy Kit documentation](https://github.com/gnosis/contract-proxy-kit)
- [Web3.js docs](https://web3js.readthedocs.io/)
- [Source code for the example app](https://github.com/gnosis/cpk-compound-example)