---
id: tutorial_tx_service_set_delegate
title: Set a delegate on the Safe transaction service
sidebar_label: Set a delegate
---

The Gnosis Safe transaction service keeps track of transactions sent via Gnosis Safe contracts. Another tutorial shows how to initiate and sign transactions using this service. Initiated transactions will only be show in the official Gnosis Safe clients (Mobile & web) if the transaction was initiated and signed by an owner of the Safe. This is to prevent random accounts spamming transaction lists of Safes.

There are several use cases where it would make sense to allow non-owners to initiate transactions. As an example, complex transactions could be initiated via a script, however exposing a Safe owner key in a script is not intended.

This is where "delegates" come in. Delegates are non-owners that are authorized to initiated transactions for a specific Safe which then would show up on the official Gnosis Safe interfaces. Delegates need to be authorized by an owner of a Safe.

Delegates can be viewed, added and removed via the [Safe transaction service](services_03_transactions.md). 

## Tutorial: Set a delegate

This tutorial uses Rinkeby and therefore the [Safe transaction service on Rinkeby](https://safe-transaction.rinkeby.gnosis.io/).

As a prerequisite, you need an existing Safe on the Rinkeby testnet work. We will be using `0xaE3c91c89153DEaC332Ab7BBd167164978638c30` for this tutorial.


### Prequisites

You need `python3` and the following 3 modules installed:

```
requests
eth_account
```

We will use the following global variables throughout this tutorial so please replace accordingly:

```python
SAFE_ADDRESS = '0xaE3c91c89153DEaC332Ab7BBd167164978638c30'
OWNER_PRIVATE_KEY = '<your pk here>'
DELEGATE_ADDRESS = '0x1230B3d59858296A31053C1b8562Ecf89A2f888b'
TX_SERVICE_BASE_URL = 'https://safe-transaction.rinkeby.gnosis.io'
```

### View existing delegates

Existing delegates can be viewed via [/api/v1/safes/0xaE3c91c89153DEaC332Ab7BBd167164978638c30/delegates/](https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/0xaE3c91c89153DEaC332Ab7BBd167164978638c30/delegates/).

Note: All addresses need to be checksummed.

```python
list_response = requests.get(f'{TX_SERVICE_BASE_URL}/api/v1/safes/{SAFE_ADDRESS}/delegates')

print(list_response.text)
print(list_response.status_code)
```

### Add new delegate

There is a POST endpoint at `/api/v1/safes/{address}/delegates/` to add a new delegate.

```python
totp = int(time.time()) // 3600
hash_to_sign = keccak(text=DELEGATE_ADDRESS + str(totp))
account = Account.from_key(OWNER_PRIVATE_KEY)
signature = account.signHash(hash_to_sign)

add_payload = {
    "safe": SAFE_ADDRESS,
    "delegate": DELEGATE_ADDRESS,
    "signature": signature.signature.hex(),
    "label": "My new delegate2"
}

add_response = requests.post(f'{TX_SERVICE_BASE_URL}/api/v1/safes/{SAFE_ADDRESS}/delegates/', json=add_payload, headers = {'Content-type': 'application/json'})

print(add_response.text)
print(add_response.status_code)
```

### Remove delegate

```python
totp = int(time.time()) // 3600
hash_to_sign = keccak(text=DELEGATE_ADDRESS + str(totp))
account = Account.from_key(OWNER_PRIVATE_KEY)
signature = account.signHash(hash_to_sign)

delete_payload = {
    "signature": signature.signature.hex(),
}
delete_response = requests.delete(f'{TX_SERVICE_BASE_URL}/api/v1/safes/{SAFE_ADDRESS}/delegates/{DELEGATE_ADDRESS}/', json=delete_payload, headers = {'Content-type': 'application/json'})

print(delete_response.text)
print(delete_response.status_code)
```