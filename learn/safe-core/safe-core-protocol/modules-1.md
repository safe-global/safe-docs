# Modules

Modules add custom features to Safe contracts. They are smart contracts that implement the Safe’s functionality while separating module logic from the Safe’s core contract. A basic Safe does not require any modules. Adding and removing a module requires confirmation from the configured threshold number of owners. Modules are security-critical, so they need to be as secure as all other Safe contracts. Events are emitted whenever a module is added or removed and whenever a module transaction was successful or failed.

Modules can include daily spending allowances, amounts that can be spent without the approval of other owners, recurring transactions modules, standing orders that are performed on a recurring set date, e.g. paying your rent, and social recovery modules, which may allow you to recover a Safe if you lose access to owner accounts. These are just a few examples of how to use modules, but there are many other ways you could use modules in your Safe.

## How to Create a Safe Module

A great way to understand how Safe modules work is by creating one. A great place to start is [Gnosis Safe 🛠 Safe modding 101: Create your own Safe module](https://www.youtube.com/watch?v=nmDYc9PlAic).

{% embed url="https://www.youtube.com/watch?v=nmDYc9PlAic" %} Watch on Youtube {% endembed %}

## Examples
1. [Safe Modules](https://github.com/gnosis/safe-modules)
2. [Zodiac-compliant modules](https://zodiac.wiki/index.php/Introduction:_Zodiac_Standard#Modules)
