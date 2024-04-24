# Safe Signatures

This guide shows how Safe signatures work and how to generate them using the Protocol Kit.

## Setup

Safe accounts can be configured with different threshold values and types of owners. Safe owners can be any Ethereum address, such as:
- Externally-owned accounts (EOAs). They generate an ECDSA signature to approve Safe transactions.
- Smart accounts that implement the [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) for signature validation, like Safe does. They use a different signature algorithm depending on the implementation of the smart account.

In the following guides, there are different accounts involved that will be used as an example:

| Who | Description | Address for this example |
| :--- | :--- | :--- |
| `safe3_4` | 3/4 Safe (3 signatures required out of 4 owners) | 0xb3b3862D8e38a1E965eb350B09f2167B2371D652 |
| `owner1` | EOA and owner of `safe3_4` | 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 |
| `owner2` | EOA and owner of `safe3_4` | 0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0 |
| `safe1_1` | 1/1 Safe and owner of `safe3_4` | 0x215033cdE0619D60B7352348F4598316Cc39bC6E |
| `owner3` | EOA and owner of `safe1_1` | 0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b |
| `safe2_3` | 2/3 Safe and owner of `safe3_4` | 0xf75D61D6C27a7CC5788E633c1FC130f0F4a62D33 |
| `owner4` | EOA and owner of `safe2_3` | 0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d |
| `owner5` | EOA and owner of `safe2_3` | 0xd03ea8624C8C5987235048901fB614fDcA89b117 |

Each EOA owner described above is bound to an `EthAdapter` instance that should also be initialized.

| Adapter | Signer |
| :--- | :--- |
| `ethAdapter1` | `owner1` |
| `ethAdapter2` | `owner2` |
| `ethAdapter3` | `owner3` |
| `ethAdapter4` | `owner4` |
| `ethAdapter5` | `owner5` |

## Guides

### Transaction signatures

- The [Transaction signatures](./signatures/transactions.mdx) guide explains how transactions are signed by Safe owners using the Protocol Kit.

### Message signatures

- Using the Protocol Kit, the [Message signatures](./signatures/messages.mdx) guide explains how to generate and sign messages, including plain string messages and EIP-712 JSON messages.
