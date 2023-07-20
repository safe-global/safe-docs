# Safe Plugins

Safe Plugins add custom features to Safe contracts. They are smart contracts that implement Safe's functionality while separating plugin logic from Safes core contracts. A basic Safe does not require any plugin. Adding and removing a plugin requires confirmation from the configured threshold number of owners. Events are emitted whenever a plugin is added or removed, and a plugin transaction succeeds or fails.

Safe Plugins can include daily spending allowances, amounts that can be spent without the approval of other owners, recurring transactions plugins, standing orders that are performed on a recurring set date, e.g. paying your rent, and social recovery plugins, which may allow you to recover a Safe if you lose access to owner accounts. These are just a few examples of how to use plugins, but there are many other ways you could use plugins in your Safe.

<img src="https://user-images.githubusercontent.com/9806858/234940596-321b1c8c-c311-4016-84fe-d8aa8f550b06.jpg" alt="">

## How to create a Safe Plugin

A great way to understand how Safe Plugins work is by creating one. A great place to start is [Gnosis Safe 🛠 Safe modding 101: Create your own Safe Plugin](https://www.youtube.com/watch?v=nmDYc9PlAic).

{% embed url="https://www.youtube.com/watch?v=nmDYc9PlAic" %}
Watch on Youtube
{% endembed %}

## Examples

1. [Safe Plugins](https://github.com/safe-global/safe-modules)
2. [Zodiac-compliant plugins](https://zodiac.wiki/index.php/Introduction:_Zodiac_Standard#Modules)

{% hint style="danger" %}
Safe Plugins are a security risk since they can execute arbitrary transactions, so only trusted and audited plugins should be added to a Safe. A malicious plugin can completely takeover a Safe.
{% endhint %}
