# Guards

Transaction guards have been introduced with [Safe contracts version 1.3.0](https://github.com/gnosis/safe-contracts/blob/v1.3.0/CHANGELOG.md). They are used when there are restrictions on top of the `n`-out-of-`m` scheme.

Transaction guards can make checks before and after a Safe transaction.

The check before a transaction can, e.g. programmatically check all of the parameters of the respective transaction prior to execution.

This check after a transaction is called at the very end of the transaction execution and can be used to, e.g. perform checks on the final state of the Safe.

For examples of transaction guards, see the implementations from [Zodiac](https://github.com/gnosis/zodiac-guard-scope) and [Yearn](https://mirror.xyz/yearn-finance-engineering.eth/9uInM\_sCrogPBs5qkFSNF6qe-32-0XLN5bty5wKLVqU).

![safe-guard-diagram](https://user-images.githubusercontent.com/9806858/234941573-736dd09d-9ca6-4233-b74d-84cdb7d310e4.jpg)
Safe Guard flow on a Safe Smart Account. Source: [Safe Smart Accounts & Diamond Proxies](https://safe.mirror.xyz/P83_rVQuUQJAM-SnMpWvsHlN8oLnCeSncD1txyMDqpE)

{% hint style="danger" %}
**IMPORTANT: Since a guard has full power to block Safe transaction execution, a broken guard can cause a denial of service for a Safe. Make sure to audit the guard code and pay attention to recovery mechanisms.**
{% endhint %}
