# Safe Guards

Safe Guards have been introduced with [Safe contracts version 1.3.0](https://github.com/safe-global/safe-contracts/blob/v1.3.0/CHANGELOG.md). They are used when there are restrictions on top of the `n`-out-of-`m` scheme.

Safe Guards can make checks before and after a Safe transaction.

The check before a transaction can, e.g. programmatically check all of the parameters of the respective transaction prior to execution.

This check after a transaction is called at the very end of the transaction execution and can be used to, e.g. perform checks on the final state of the Safe.

To read about different examples of Safe Guards, see the implementations from [Zodiac](https://github.com/gnosis/zodiac-guard-scope) and [Yearn](https://mirror.xyz/yearn-finance-engineering.eth/9uInM_sCrogPBs5qkFSNF6qe-32-0XLN5bty5wKLVqU).

<figure><img src="../.gitbook/assets/diagram-safe-guards.png" width="100%" alt="" /></figure>

{% hint style="danger" %}
**IMPORTANT: Since a Safe Guard has full power to block Safe transaction execution, a broken Guard can cause a denial of service for a Safe. Make sure to audit the Guard code and pay attention to recovery mechanisms.**
{% endhint %}
