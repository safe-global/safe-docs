# Gnosis Safe Documentation

The Gnosis Safe is a multisignature wallet with support for confirmations using signed messages based on ERC191. It is the successor of the Gnosis Multisig Wallet and combines more functionality with reduced gas costs. The Gnosis Safe allows basic wallet configuration like adding and removing owners and more advanced features like modules, which allow to do transactions with different requirements.

## Documentation
Read the last documentation in:
* [http://gnosis-safe.readthedocs.io/en/latest/](http://gnosis-safe.readthedocs.io/en/latest/)

It's a work in progress, so comments, suggestions, and collaborations are appreciated.

## Collaboration
The Gnosis Safe is made by and for the community, with the goal of having a secure and convenient way to manage Ethereum assets.

Meet the community in the Gitter channel!
* https://gitter.im/gnosis/Safe

# Generate the doc
```bash
virtualenv -p python3 env
. env/bin/activate
pip install -r requirements.txt
make livehtml
```