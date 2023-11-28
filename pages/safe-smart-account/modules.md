# Safe Modules

Safe Modules add custom features to Safe contracts. They're smart contracts that add functionality to Safe while separating module logic from Safe's core contracts. A basic Safe doesn't require any modules. Adding and removing a module requires confirmation from the configured threshold number of owners. Events are emitted whenever a module is added or removed and a module transaction succeeds or fails.

Safe Modules can include daily spending allowances, amounts that can be spent without the approval of other owners, recurring transactions modules, and standing orders performed on a recurring date. For example, paying your rent or social recovery modules may allow you to recover a Safe if you lose access to owner accounts. 

<figure><img src="../../assets/diagram-safe-modules.png" width="100%" alt="" /></figure>

## How to create a Safe Module

A great way to understand how Safe Modules work is by creating one. An excellent place to start is [Safe Modding 101: Create your own Safe Module](https://www.youtube.com/watch?v=nmDYc9PlAic).

{% embed url="https://www.youtube.com/watch?v=nmDYc9PlAic" %}
Watch on YouTube
{% endembed %}

## Examples

1. [Safe Modules](https://github.com/safe-global/safe-modules)
2. [Zodiac-compliant modules](https://zodiac.wiki/index.php/Introduction:_Zodiac_Standard#Modules)
3. [Pimlico](https://docs.pimlico.io/permissionless/how-to/accounts/use-safe-account)

{% hint style="danger" %}
Safe Modules can be a security risk since they can execute arbitrary transactions. Only add trusted and audited modules to a Safe. A malicious module can take over a Safe.
{% endhint %}
