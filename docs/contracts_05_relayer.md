---
id: contracts_relayer
title: Meta transactions relays and the Safe
sidebar_label: Meta transactions relays and the Safe
---
To improve the user experience of the clients Gnosis is offering a [relay service](../services/relay.html). There are multiple endpoints on this service for the purpose of deploying a Safe contract, estimating transactions and submitting transactions.

As all the parameters required for execution are part of the submitted transaction it is possible that miners front-run the original relayer to receive the reward. In the long run that behaviour would be appreciated, since it would allow that anybody submits these transactions with  <span style="color:#DB3A3D">`gasPrice`</span> of the transaction triggering  <span style="color:#DB3A3D">`execTransaction`</span> set to 0. Miners could pick up these transactions and claim the rewards. This is why it is possible to specify the account that should receive the refund.

The vision for submitting Safe transactions would be the following:

1. Acquire estimates for a Safe transaction from potential relayers
1. Choose a relayer and generate the signatures for the Safe transaction (the chosen relayer should be set to receive the rewards to prevent front-running)
1. Submit the Safe transaction with all required paramters to the chosen relayer.

Currently this is implemented as a simple REST API. But the idea would be to make use of an open decentralized system that supports different relayers (see [MetaCartel](https://github.com/Meta-tx)).

## Rationale of parameters
The  <span style="color:#DB3A3D">`execTransaction`</span> has quite some parameters which might be unnecessary for other projects that want to use a relay service. To better understand why this set of paramters was chosen the rationale of them will be outlined.

### <span style="color:#DB3A3D">`operation`</span>
The Safe contract allows the execution different types of transactions. These are differentiated by the operation. Currently the Safe supports three different types of transactions:  <span style="color:#DB3A3D">`CALL`</span>,  <span style="color:#DB3A3D">`DELEGATECALL`</span> and  <span style="color:#DB3A3D">`CREATE`</span>.

###  <span style="color:#DB3A3D"> `safeTxGas`</span>
When a relayer submits a transaction with valid signatures it should be paid even if the Safe transaction fails. This has been done for the following reasons:

1. If the transaction fails the signatures stay valid. Therefore it would be possible to potentially replay the transaction.
1. The relayer should always be paid even if the Safe transaction fails (e.g. due to state changes)

Is is necessary that the relayer cannot make the Safe transaction to fail on purpose. This would make it possible that the relayer gets paid without performing the Safe transaction. For this the client needs to specify the minimum required gas for the Safe transaction. This is similar to the gas limit of a normal Ethereum transaction.

###  <span style="color:#DB3A3D">`dataGas`</span>
As outlined before `safeTxGas` only specifies how much gas should be available for the Safe transaction. The gas that the client needs to pay for is determined at runtime. But there are some static costs. This includes the costs for the payload and the gas required to perform the payment transfer.

###  <span style="color:#DB3A3D">`refundReceiver`</span>
It is possible to specify the receiver of the refund to avoid that submitted transactions can be front-run by others.

## Demo (on **Rinkeby**)

```bash
mkdir safe-demo
cd safe-demo
truffle unbox gnosis/safe-demo
```
