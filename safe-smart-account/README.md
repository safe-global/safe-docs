# Safe Smart Account

The vision for Safe Smart Accounts is to become the standard core used in all smart contract-based wallets. It also aims to make the benefits of Account Abstraction accessible to users and developers.

The architectural design of Safe Smart Account keeps the following principles in mind:

- **Secure default**
    - Uses a multi-signature logic where a threshold of owners must confirm a transaction before execution to provide a secure default without trusting any additional contract. For example, a module, guard, or fallback handler (explained below).

- **Minimal gas costs**
    - Optimises gas costs by storing the transaction data that should be executed and the confirmations off-chain.
    - Uses a proxy pattern to reduce setup costs.

- **Maximum flexibility**
    - Support Modules are contracts that can use alternative access patterns (instead of multi-signature) to execute transactions.
    - Supports the `delegatecall` function, which introduces complex execution logic by loading instructions from other contracts and executing via a Safe Smart Account.

Here are some core components of a Safe Smart Account that you will learn about:

## Safe Modules

[Safe Modules](modules.md) are smart contracts that extend Safe's functionality with added custom features while the module logic remains separate from Safe's core contracts. 

## Safe Guards

[Safe Guards](guards.md) make checks before and after a Safe transaction.

## Signatures

Safe contracts support alternative [signature schemes](signatures/README.md) such as [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) and [EIP-712](https://eips.ethereum.org/EIPS/eip-712) and relaying by making the confirmation/verification logic independent of `msg.sender`.
