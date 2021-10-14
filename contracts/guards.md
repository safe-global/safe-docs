# Guards

Transaction guards have been introduced with [Safe contracts version 1.3.0](https://github.com/gnosis/safe-contracts/blob/v1.3.0/CHANGELOG.md). They are used when there are restrictions on top of the `n`-out-of-`m` scheme.

Transaction guards can make checks before and after a Safe transaction.

The check before a transaction can e.g. programmatically check all of the parameters of the respective transaction prior to execution.

This check after a transaction is called at the very end of the transaction execution and can be used to e.g. perform checks on the final state of the Safe.

For examples of transaction guards please find implementations from Zodiac [here](https://github.com/gnosis/zodiac-guard-scope). 
