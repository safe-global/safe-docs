# Safe Modules

{% hint style="info" %}
After the latest alpha release of the Safe{Core} Protocol we are encouraging developers to learn more about [Plugins](./README.md). Plugins are an "evolution" of Modules with certain similarities but remarkable improvements. Modules and Plugins are not backwards compatible. Read more about Plugins [here](./README.md).
{% endhint %}

Safe Modules add custom features to Safe contracts. They are smart contracts that implement Safe's functionality while separating module logic from Safes core contracts. A basic Safe does not require any module. Adding and removing a module requires confirmation from the configured threshold number of owners. Events are emitted whenever a module is added or removed, and a module transaction succeeds or fails.

Safe Modules can include daily spending allowances, amounts that can be spent without the approval of other owners, recurring transactions modules, standing orders that are performed on a recurring set date, e.g. paying your rent, and social recovery modules, which may allow you to recover a Safe if you lose access to owner accounts. These are just a few examples of how to use modules, but there are many more.

<figure><img src="https://user-images.githubusercontent.com/9806858/234940596-321b1c8c-c311-4016-84fe-d8aa8f550b06.jpg" width="100%" alt="" /></figure>

## How to create a Safe Module

A great way to understand how Safe Modules work is by creating one. A great place to start is [Gnosis Safe 🛠 Safe modding 101: Create your own Safe Module](https://www.youtube.com/watch?v=nmDYc9PlAic).

{% embed url="https://www.youtube.com/watch?v=nmDYc9PlAic" %}
Watch on Youtube
{% endembed %}

## Examples

1. [Safe Modules](https://github.com/safe-global/safe-modules)
2. [Zodiac-compliant modules](https://zodiac.wiki/index.php/Introduction:_Zodiac_Standard#Modules)

{% hint style="danger" %}
Safe Modules are a security risk since they can execute arbitrary transactions, so only trusted and audited modules should be added to a Safe. A malicious module can completely takeover a Safe.
{% endhint %}
