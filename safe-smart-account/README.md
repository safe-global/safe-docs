# Safe Smart Account

The vision for Safe Smart Accounts is to become the standard core used in all smart contract-based wallets and make the benefits of Account Abstraction easily accessible to users and developers.

The Safe Smart Account architecture was first designed with the following principles in mind:

- **Secure default**
    - Uses a multi-signature logic–where a threshold of owners have to confirm a transaction before it can be executed–at its core to provide a secure default that can be used without trusting any additional contract, e.g., a module, guard, or fallback handler.

- **Minimal gas costs**
    - Optimises gas costs by storing the transaction data that should be executed and the confirmations off-chain.
    - Uses a proxy pattern to reduce setup costs.

- **Maximum flexibility**
    - Supports Modules are contracts that can use alternative access patterns (instead of multi-signature) to execute transactions.
    - Supports the "delegatecall" function, which introduces complex execution logic by loading instructions from other contracts and executing via a Safe Smart Account.

Here are some of the core components of a Safe Smart Account that you will learn about:

## Safe Modules

Safe Modules are smart contracts that extend Safe's functionality with added custom features while the module logic remains separate from Safe's core contracts. 

## Safe Guards

Safe Guards make checks before and after a Safe transaction.

## Signatures

Safe contracts support alternative signature schemes such as EIP-1271 and EIP-712 and relaying by making the confirmation/verification logic independent of `msg.sender`.

Each new version of Safe's core contracts evolves to meet the changing needs of the ecosystem while continuing to adhere to the principles of maximum flexibility with a secure default. It is a matter of constantly evaluating what functionality and standards should be a part of the next Safe version and what security impact it has to add support for these. In addition, it is important to iterate on the current support for unused or outdated features and standards to limit any security impact.
