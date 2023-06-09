# Modules

Modules add custom features to Safe contracts. They are smart contracts that implement Safe’s functionality while separating module logic from Safe’s core contract. A basic Safe does not require any modules. Adding and removing a module requires confirmation from the configured threshold number of owners. Events are emitted whenever a module is added or removed, and a module transaction succeeds or fails.

Modules can include daily spending allowances, amounts that can be spent without the approval of other owners, recurring transactions modules, standing orders that are performed on a recurring set date, e.g. paying your rent, and social recovery modules, which may allow you to recover a Safe if you lose access to owner accounts. These are just a few examples of how to use modules, but there are many other ways you could use modules in your Safe.

<figure><img src="https://user-images.githubusercontent.com/9806858/234940596-321b1c8c-c311-4016-84fe-d8aa8f550b06.jpg" alt=""><figcaption><p>Safe Module Interaction with a Safe Smart Account. Source: <a href="https://safe.mirror.xyz/P83_rVQuUQJAM-SnMpWvsHlN8oLnCeSncD1txyMDqpE">Safe Smart Accounts &#x26; Diamond Proxies</a></p></figcaption></figure>

## How to Create a Safe Module

A great way to understand how Safe modules work is by creating one. A great place to start is [Gnosis Safe 🛠 Safe modding 101: Create your own Safe module](https://www.youtube.com/watch?v=nmDYc9PlAic).

{% embed url="https://www.youtube.com/watch?v=nmDYc9PlAic" %}
Watch on Youtube
{% endembed %}

## Examples

1. [Safe Modules](https://github.com/gnosis/safe-modules)
2. [Zodiac-compliant modules](https://zodiac.wiki/index.php/Introduction:\_Zodiac\_Standard#Modules)

{% hint style="danger" %}
Modules are a security risk since they can execute arbitrary transactions, so only trusted and audited modules should be added to a Safe. A malicious module can completely takeover a Safe.
{% endhint %}
