---
id: introduction3
title: The Gnosis Safe Smart Contracts
sidebar_label: The Gnosis Safe Smart Contracts
---

The core functions of the Gnosis Safe smart contracts can be boiled down to the main functionalities outlined below. 

## Transaction execution

Transaction execution allows you to perform transactions, including signature check and optional token payment, and approve transactions (on-chain transaction approval). A transaction is the primary way to interact with the Ethereum network; transactions modify or update the state stored in the Ethereum network.

Transactions can include: 
* Transfer funds between two parties
* Deploy a smart contract on the Ethereum Network
* Execute a function within a deployed contract	

Using an EOA wallet, a transaction will be executed in the following manner. First a user submits the Ethereum address the transaction will be sent to, including the value of the transaction and data that may be sent with the transaction. In order to protect against the same transaction being executed twice, a nonce is attributed with each transaction; nonce is a number that is incremented by one for every transaction made. Additionally,  Ethereum has transaction fees expressed in “gas” costs. Gas costs are transaction fees paid by the transaction sender that incentive miners to execute a transaction. Ultimately, transaction fees have to be paid in ETH. When sending a transaction, a gas limit is set. The gas price then sets the exchange rate between gas and ETH. The transaction fee (gas price * gas limit) is deducted from the sender’s account balance.

## Meta transactions via a transaction relayer

In the process described above, transactions need to be signed and submitted by an EOA, since it is not possible for a contract account as this process would require a private key. That means, users of multi-signature wallets such as the Gnosis Safe would have to make sure they keep enough ETH external to their Safe in an EOA in order to make transactions. Of course, this isn’t very practical nor user friendly. Fortunately, meta transactions solve this issue for users. The term itself “meta transaction” is used by a number of projects in Ethereum, and they usually refer to transactions of an account which are not submitted by the same account but rather by another account on the former’s behalf. The following section will describe the meta transaction of the Gnosis Safe contracts via a transaction relay service. 


Using the Gnosis Safe, users generally interact with “clients,” which can be a mobile app or a browser extension. These clients are owners of a Safe multi-signature wallet. The first step in the process of sending transactions is comparable to that of an EOA account. The client collects all transaction information, e.g. address, value, data. Next, however, a transaction relayer service will calculate a gas limit estimate which is comparable a similar transaction from an EOA. Here, it consists of safe tx gas, which is the minimum amount of gas that is provided for the Safe transaction and base gas, which is the amount of gas that is independent of specific Safe transactions, but used for general actions such as signature checks and the base transaction fee. The client sets a gas price after pulling information about current gas prices from the transaction relay service. This price is multiplied by safe tx gas and base gas, and then it is displayed to the user for confirmation. Before sending it so the relay service all required signatures need to be collected. The relay service then will check the provided data, signatures, gas limit, and gas price. Lastly, the relay service submits the transaction to the Ethereum blockchain by creating another transaction that encapsulates the (meta) transaction data of the Safe inside the data and to fields. Gas limit, gas price, and signature are set by the transaction relay service. The service returns the hash of that executed transaction for the client to check the progress.The Ethereum blockchain picks up the transaction and it is executed


In short, this service allows users to execute transactions from the Safe client, by abstracting an owner of the Safe that doesn’t need to hold any ETH itself but can execute transactions on the client’s behalf. The transaction relay service acts as a trustless intermediary. 
