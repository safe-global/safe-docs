# Modules

Modules add additional functionalities to the Safe contracts. They are smart contracts that implement the Safe’s functionality while separating module logic from the Safe’s core contract. Depending on the use case, modules could for instance allow the execution of transactions without requiring all confirmation. A basic Safe does not require any modules. Adding and removing a module requires confirmation from all owners. Modules are very security-critical, so they need to be as secure as all other Safe contracts. Events are emitted whenever a module is added or removed and also whenever a module transaction was successful or failed.

Modules can include daily spending allowances, amounts that can be spent without the approval of other owners, recurring transactions modules, standing orders that are performed on a recurring set date, e.g. paying your rent, and social recovery modules, which may allow you to recover a Safe in case access to owner accounts were lost. This is just a short example list of possible modules, and one can think of many other modules that could be beneficial to your wallet. Modules enable developers to include their own features via a separate smart contract.

For examples of modules please find the few examples [here](https://github.com/gnosis/safe-modules) and modules created by the Zodiac team [here](https://github.com/gnosis/zodiac#modules). 

