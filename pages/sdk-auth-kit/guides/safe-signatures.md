# Safe signatures

Understanding and generating signatures is not an easy task. In the **Safe{Core} SDK** we have a set of utilities that can help using them with Safe. In this article we are going to explain how signatures work and look like and hor to generate them using the `protocol-kit` utilities.

## Safe Accounts threshold setup

Your Safe Account can be configured with different thresholds and different kind of owners. An owner can be any ethereum address such as a:

- External Owned Account (EOA)
- Another Safe Account (Child signer Safe)

When the owner is an EOA we generate a signature that is different that the signature we create using a Safe Account. The Safe Account is an Smart Contract Account to we have to take this into account when we try to gather the signatures as the Safe Contracts validate them in a different way.

For the examples in this article we are going to use the following Safe Account setup, given we have 5 different ethereum addresses that can be signers (o*wner1 to owner5*):

- `safeAddress3_4`: Safe Account with a 3/4 threshold configured
  - `owner1`
  - `owner2`
  - `signerSafe1_1`: A 1/1 Safe Account as an owner
    - `owner3`
  - `signerSafe2_3`: A 2/3 Safe Account as another owner
    - `owner4`
    - `owner5`

All the `ownerX` are basically ethereum addresses. For this example the addresses are these ones

| Who                | Address                                    |
| ------------------ | ------------------------------------------ |
| **safeAddress3_4** | 0xb3b3862D8e38a1E965eb350B09f2167B2371D652 |
| **owner1**         | 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 |
| **owner2**         | 0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0 |
| **signerSafe1_1**  | 0x215033cdE0619D60B7352348F4598316Cc39bC6E |
| **owner3**         | 0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b |
| **signerSafe2_3**  | 0xf75D61D6C27a7CC5788E633c1FC130f0F4a62D33 |
| **owner4**         | 0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d |
| **owner5**         | 0xd03ea8624C8C5987235048901fB614fDcA89b117 |

## Transactions

### Creating the transaction object

We can sign a transactions using the `protocol-kit`. For that we need a `protocol-kit` instance. We can instantiate it like this:

```typescript
const protocolKit = await Safe.create({
  ethAdapter: ethAdapter1, //EthAdapter, any compatible adapter as Web3Adapter or EthersAdapter can be used
  safeAddress: safeAddress3_4,
});
```

The `ethAdapter1` is bound to the `owner1`. For the examples in this article we are going to have 5 ethAdapters each one bound with an owner

| Adapter     | Owner  |
| ----------- | ------ |
| ethAdapter1 | owner1 |
| ethAdapter2 | owner2 |
| ethAdapter3 | owner3 |
| ethAdapter4 | owner4 |
| ethAdapter5 | owner5 |

Once we have the `protocolKit` instance we use `createTransaction()` to generate a transaction

```typescript
// Create the transaction. Send 0.01 ETH to anyEthereumAddress
const safeTransactionData: SafeTransactionDataPartial = {
  to: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
  value: '100000000000000000', // 0.01 ETH
  data: '0x',
};

let safeTx = await protocolKit.createTransaction({
  transactions: [safeTransactionData],
});
```

This `safeTx` is an `EthSafeTransaction` object that stores the transaction data (`data`) and a map of owner - signature (`signatures`)

```typescript
class EthSafeTransaction implements SafeTransaction {
  data: SafeTransactionData
  signatures: Map<string, SafeSignature> = new Map()
...
// Other props and methods
}
```

### Generating the transaction signatures

Now that we have the transaction object (`safeTx`) it’s time to add the required signatures

#### Creating a ECDSA signature

---

We are going to sign with `owner1` and `owner2`. For that we use the `signTransaction()` method that takes the tx `data` and add a new signature to the `signatures` map

```typescript
safeTx = await protocolKit.signTransaction(safeTx, SigningMethod.ETH_SIGN); // owner1 EIP-191 signature
protocolKit = await protocolKit.connect({ ethAdapter: ethAdapter2 }); // Connect another owner
safeTx = await protocolKit.signTransaction(
  safeTx,
  SigningMethod.ETH_SIGN_TYPED_DATA_V4
); // owner2 EIP-712 typed data signature (default)
```

In this snippet we are adding the signature for `owner1`, then we are connecting the `owner2` and signing again to add the second signature

If we explore at this point the `safeTx` object we should see something like this:

```json
EthSafeTransaction {
  signatures: Map(2) {
    '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1' => EthSafeSignature {
      signer: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      data: '0x969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b1261f',
      isContractSignature: false
    },
    '0xffcf8fdee72ac11b5c542428b35eef5769c409f0' => EthSafeSignature {
      signer: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
      data: '0x4d63c79cf9d743782bc31ad58c1a316020b39839ab164caee7ecac9829f685cc44ec0d066a5dfe646b2ffeeb37575df131daf9c96ced41b8c7c4aea8dc5461801c',
      isContractSignature: false
    }
  },
  data: { ... }
}
```

Inside the signatures map, the `data` prop represents the signature and the `isContractSignature` flag indicates that this signature is a ECDSA signature. An Ethereum signature comprises two 32-byte integers (r, s) and an extra byte for recovery id (v), so in total a signature has 65 bytes. In a hexadecimal string representation, each byte uses 2 characters. Therefore, a 65-byte Ethereum signature will consist of 130 characters. Since signatures are often prefixed with '0x' for context, you can expect to see 132 characters in total that is the number of characters you can count in this produced signatures. More detailed explanation can be found [here](https://docs.safe.global/safe-smart-account/signatures).

The last part of the signature `1f` or `1b` indicates the signature type:

- The hexadecimal number "1f” converts to the decimal number 31 and indicates the signature is an `eth_sign` as the number is greater than 30 (This is being adjusted for the eth_sign flow [in the contracts](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/Safe.sol#L344-L347))
- The hexadecimal number "1b" converts to the decimal number 27 and indicates the signature is a types data signature.

For example, for the first signature `0x969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b1261f`:

| Type           | Bytes | Value                                                                                                                            | Description             |
| -------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Hex            | 1     | 0x                                                                                                                               | Hex string characters   |
| Signature      | 64    | 969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b126 | Signature bytes         |
| Signature Type | 1     | 1f                                                                                                                               | 1f hex is 31 in decimal |

#### Creating Smart contract signatures (EIP-1271)

---

**1/1 Safe Account**

The Smart contract signatures supported by Safe look different than the regular ECDSA ones. In order to generate this kind of signatures we are going to use the special method `SigningMethod.ETH_SIGN_TYPED_DATA_V4`.

We are going to start signing using the 1/1 Safe so we need the adapter for the `owner3` and we need to specify as well the new `safeAddress` on charge of the signature, the child Safe Accounn address. So, let’s connect the adapter and safe and sign:

```typescript
// Create a new transaction object. Should produce same txHash but the signatures array is empty now
let signerSafeTx1_1 = await protocolKit.createTransaction({
  transactions: [safeTransactionData],
});

// Connect the adapter for owner3 and specify the address of the signer Safe Account
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter3,
  safeAddress: signerSafeAddress1_1,
});

// Sign the transaction
signerSafeTx1_1 = await protocolKit.signTransaction(
  signerSafeTx1_1,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress3_4 //Parent Safe address
);
```

Once signed, we are going to have an transaction object (`signerSafeTx1_1`) like this one:

```json
EthSafeTransaction {
  signatures: Map(1) {
    '0x22d491bde2303f2f43325b2108d26f1eaba1e32b' => EthSafeSignature {
      signer: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
      data: '0x5edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f',
      isContractSignature: false
    }
  },
  data: { ...}
}
```

Inside the signatures map there is a regular ECDSA signature (`isContractSignature = false`) and we can use it to produce the **EIP-1271** compatible signature by leveraging the `buildContractSignature()` [utility method](https://github.com/safe-global/safe-core-sdk/blob/cce519b4204b2c54ae0c3d2295ab6031332c0fe7/packages/protocol-kit/src/utils/signatures/utils.ts#L139-L150) that takes an array of signatures and creates a signature that Safe contracts can understand

```typescript
const signerSafeSig1_1 = await buildContractSignature(
  Array.from(signerSafeTx1_1.signatures.values()),
  signerSafeAddress1_1
);
```

The contract signature will look like like this

```
EthSafeSignature {
  signer: '0x215033cdE0619D60B7352348F4598316Cc39bC6E',
  data: '0x5edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f',
  isContractSignature: true
}
```

Basically what changed is the signer and the `isContractSignature` method but this change will be the key one when joining all the signatures by calling the `buildSignatureBytes()` [method](https://github.com/safe-global/safe-core-sdk/blob/cce519b4204b2c54ae0c3d2295ab6031332c0fe7/packages/protocol-kit/src/utils/signatures/utils.ts#L152-L189)

Let’s do that

```typescript
console.log(buildSignatureBytes([signerSafeSig1_1])
```

The output will be

```
0x000000000000000000000000215033cdE0619D60B7352348F4598316Cc39bC6E00000000000000000000000000000000000000000000000000000000000000410000000000000000000000000000000000000000000000000000000000000000415edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f
```

Let’s decompose this signature in parts

| Type             | Bytes | Value                                                                                                                              | Description                                                                                                                                      |
| ---------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hex              | 1     | 0x                                                                                                                                 | Hex string characters                                                                                                                            |
| Verifier         | 32    | 000000000000000000000000215033cdE0619D60B7352348F4598316Cc39bC6E                                                                   | Padded address of the contract that implements the EIP-1271 interface to verify the signature. The Safe signer address                           |
| Data position    | 32    | 0000000000000000000000000000000000000000000000000000000000000041                                                                   | Position of the start of the signature data (offset relative to the beginning of the signature data). 41 hex is 65 in decimal                    |
| Signature Type   | 1     | 00                                                                                                                                 | 00 for [Safe Accounts](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/Safe.sol#L322-L336) |
| Signature Length | 32    | 0000000000000000000000000000000000000000000000000000000000000041                                                                   | The length of the signature. 41 hex is 65 in decimal                                                                                             |
| Signature        | 65    | 5edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f | Signature bytes that are verified by the signature verifier                                                                                      |

And this is how looks like an **EIP-1271** contract signature for Safe contracts. Now that we demistified this long string let’s ad the signature to the original transaction

```typescript
safeTx.addSignature(signerSafeSig1_1);
```

Let’s do the same for the other Safe signer

**2/3 Safe Account**

The 2/3 Safe Account need at least 2 signatures in order to consider it valid. Let’s sign with the owners `owner4` and `owner5`

```typescript
// Create a new transaction object. Should produce same txHash but the signatures array is empty now
let signerSafeTx2_3 = await protocolKit.createTransaction({
  transactions: [safeTransactionData],
});

// Connect the adapter for owner4 and specify the address of the signer Safe Account
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter4,
  safeAddress: signerSafeAddress2_3,
});

// Sign the transaction
signerSafeTx2_3 = await protocolKit.signTransaction(
  signerSafeTx2_3,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress3_4
);

// Conects the adapter for owner5
protocolKit = await protocolKit.connect({ ethAdapter: ethAdapter5 });

// Sign the transaction
signerSafeTx2_3 = await protocolKit.signTransaction(
  signerSafeTx2_3,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress
);
```

Once signed, we are going to have a transaction obecjet like this one:

```javascript
EthSafeTransaction {
  signatures: Map(2) {
    '0xe11ba2b4d45eaed5996cd0823791e0c93114882d' => EthSafeSignature {
      signer: '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d',
      data: '0xd3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f',
      isContractSignature: false
    },
    '0xd03ea8624c8c5987235048901fb614fdca89b117' => EthSafeSignature {
      signer: '0xd03ea8624C8C5987235048901fB614fDcA89b117',
      data: '0x023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520',
      isContractSignature: false
    }
  },
  data: { ... }
}
```

Now we have 2 signatures from the owners `owner4` and `owner5`. Doing the same exercise we can build the contract signature and log the final one

```typescript
const signerSafeSig2_3 = await buildContractSignature(
  Array.from(signerSafeTx2_3.signatures.values()),
  signerSafeAddress2_3
)
console.log(buildSignatureBytes([signerSafeSig2_3])
```

The output will be

```
0x000000000000000000000000f75D61D6C27a7CC5788E633c1FC130f0F4a62D330000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000082023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520d3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f
```

Let’s decompose again this signature in parts

| Type             | Bytes | Value                                                                                                                                                                                                                                                                | Description                                                                                                                                      |
| ---------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hex              | 1     | 0x                                                                                                                                                                                                                                                                   | Hex string characters                                                                                                                            |
| Verifier         | 32    | 000000000000000000000000f75D61D6C27a7CC5788E633c1FC130f0F4a62D33                                                                                                                                                                                                     | Padded address of the contract that implements the EIP-1271 interface to verify the signature. The Safe signer address                           |
| Data position    | 32    | 0000000000000000000000000000000000000000000000000000000000000041                                                                                                                                                                                                     | Position of the start of the signature data (offset relative to the beginning of the signature data). 41 hex is 65 in decimal                    |
| Signature Type   | 1     | 00                                                                                                                                                                                                                                                                   | 00 for [Safe Accounts](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/Safe.sol#L322-L336) |
| Signature Length | 32    | 0000000000000000000000000000000000000000000000000000000000000082                                                                                                                                                                                                     | The length of the signature. 82 hex is 130 in decimal                                                                                            |
| Signature        | 130   | 023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520d3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f | Signature bytes that are verified by the signature verifier (130 bytes are represented by 260 characters in an hex string)                       |

The decomposition looks the same but what changed is the signature length (doubled as we have 2 signatures now) and the signature itself that have the 2 regular signatures concatenated.

Let’s add the signature

```typescript
safeTx.addSignature(signerSafeSig2_3);
```

Hooray! now we are done and we signed with all the owners. Even we have one more than required as the threshold is 3 but that’s ok. Let’s take a look to the final structure of the safeTx object

```json
EthSafeTransaction {
  signatures: Map(4) {
    '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1' => EthSafeSignature {
      signer: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      data: '0x969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b1261f',
      isContractSignature: false
    },
    '0xffcf8fdee72ac11b5c542428b35eef5769c409f0' => EthSafeSignature {
      signer: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
      data: '0x4d63c79cf9d743782bc31ad58c1a316020b39839ab164caee7ecac9829f685cc44ec0d066a5dfe646b2ffeeb37575df131daf9c96ced41b8c7c4aea8dc5461801c',
      isContractSignature: false
    },
    '0x215033cde0619d60b7352348f4598316cc39bc6e' => EthSafeSignature {
      signer: '0x215033cdE0619D60B7352348F4598316Cc39bC6E',
      data: '0x5edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f',
      isContractSignature: true
    },
    '0xf75d61d6c27a7cc5788e633c1fc130f0f4a62d33' => EthSafeSignature {
      signer: '0xf75D61D6C27a7CC5788E633c1FC130f0F4a62D33',
      data: '0x023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520d3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f',
      isContractSignature: true
    }
  },
  data: {
    to: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    value: '100000000000000000',
    data: '0x',
    operation: 0,
    baseGas: '0',
    gasPrice: '0',
    gasToken: '0x0000000000000000000000000000000000000000',
    refundReceiver: '0x0000000000000000000000000000000000000000',
    nonce: 0,
    safeTxGas: '0'
  }
}
```

Four signatures (2 regular and 2 contract signatures) and the transaction data. As the threshold is 3 we can even remove one of the signatures but, anyway, the transaction is ready to be sent to the contract and to be executed.

### Executing the transaction

First, we need to connect to the original safe and to the desired adapter (must have funds to execute the transaction) as in the last step we have the `protocolKit` instance connected to the 2/3 Safe Account. Then we can execute the transaction.

```typescript
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter1,
  safeAddress,
});
const transactionResponse = await protocolKit.executeTransaction(safeTx);
```

When we call the `executeTransaction()` method, internally it uses the `safeTx.encodedSignatures()` [calls](https://github.com/safe-global/safe-core-sdk/blob/cce519b4204b2c54ae0c3d2295ab6031332c0fe7/packages/protocol-kit/src/adapters/ethers/contracts/Safe/SafeContractEthers.ts#L159-L171), that again internally, [calls](https://github.com/safe-global/safe-core-sdk/blob/cce519b4204b2c54ae0c3d2295ab6031332c0fe7/packages/protocol-kit/src/utils/transactions/SafeTransaction.ts#L24-L26) the `buildSignatureBytes()` with the 4 signatures we generated using the different owners. Let’s log that.

```typescript
console.log(safeTx.encodedSignatures()); // Calls buildSignatureBytes()
```

The final signature sent to the contract altogether with the transaction data will be:

```
0x000000000000000000000000215033cdE0619D60B7352348F4598316Cc39bC6E000000000000000000000000000000000000000000000000000000000000010400969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b1261f000000000000000000000000f75D61D6C27a7CC5788E633c1FC130f0F4a62D330000000000000000000000000000000000000000000000000000000000000165004d63c79cf9d743782bc31ad58c1a316020b39839ab164caee7ecac9829f685cc44ec0d066a5dfe646b2ffeeb37575df131daf9c96ced41b8c7c4aea8dc5461801c00000000000000000000000000000000000000000000000000000000000000415edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f0000000000000000000000000000000000000000000000000000000000000082023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520d3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f
```

The signatures are concatenated and sorted by signer address.

Let’s play the game and decompose it again!

| Type                           | Bytes | Value                                                                                                                                                                                                                                                                | Acc byte | Description                                             |
| ------------------------------ | :---: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------------------------- |
| Hex                            |   1   | 0x                                                                                                                                                                                                                                                                   |    -     | Hex string characters                                   |
| 1/1 Safe signer                |  32   | 000000000000000000000000215033cdE0619D60B7352348F4598316Cc39bC6E                                                                                                                                                                                                     |    32    | Safe Address                                            |
| Data position for 1/1 Safe     |  32   | 0000000000000000000000000000000000000000000000000000000000000104                                                                                                                                                                                                     |    64    | 104 hex = Signature data for 1/1 Safe start at byte 260 |
| Signature Type                 |   1   | 00                                                                                                                                                                                                                                                                   |    65    | Smart contract signature                                |
| Owner signature                |  65   | 969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b1261f                                                                                                                                   |   130    | `owner1` signature                                      |
| 2/3 Safe signer                |  32   | 000000000000000000000000f75D61D6C27a7CC5788E633c1FC130f0F4a62D33                                                                                                                                                                                                     |   162    | Safe Address                                            |
| Data position for 2/3 Verifier |  32   | 0000000000000000000000000000000000000000000000000000000000000165                                                                                                                                                                                                     |   194    | 165 hex = Signature data for 2/3 Safe start at byte 357 |
| Signature Type                 |   1   | 00                                                                                                                                                                                                                                                                   |   195    | Smart contract signature                                |
| Owner signature                |  65   | 4d63c79cf9d743782bc31ad58c1a316020b39839ab164caee7ecac9829f685cc44ec0d066a5dfe646b2ffeeb37575df131daf9c96ced41b8c7c4aea8dc5461801c                                                                                                                                   |   260    | `owner2` signature                                      |
| 1/1 Safe Signature Length      |  32   | 0000000000000000000000000000000000000000000000000000000000000041                                                                                                                                                                                                     |   292    | Start of the 1/1 Safe Signature. 41 hex = 65 bytes      |
| Signature                      |  65   | 5edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f                                                                                                                                   |   357    | `owner3` signature                                      |
| 2/3 Safe Signature length      |  32   | 0000000000000000000000000000000000000000000000000000000000000082                                                                                                                                                                                                     |   389    | Start of the 2/3 Safe Signature. 82 hex = 130 bytes     |
| Signature                      |  130  | 023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520d3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f |   519    | `owner4` and `owner5` concatenated signatures           |

Now, the transaction should be executed on-chain and the process is finished

### Proposing transactions using Safe Services

In the example we just saw until now we are using the `protocol-kit` utilities to create and compose a signature in order to execute a transaction with Safe. For doing this we don’t need any kind of service and all can be executed on-chain but if you imagine doing this in any application in implies gathering this signatures from different ethereum addresses, wallets, private keys … different user so you can create your own system (API, services …) to store each signature before sending it to the blockchain (We do not recommend 😰) or you can use Safe services to do that.

We have deployed Safe services in the [main chains](https://docs.safe.global/safe-core-api/supported-networks):

- [Safe Transaction Service](https://docs.safe.global/safe-core-api/service-architecture/safe-transaction-service)
- [Transaction Service Swagger](https://safe-transaction-mainnet.safe.global/)

The API can be used directly to gather signatures but we have another package leveraging the usage of the transaction service, the `api-kit`. Using this kit you can propose transaction and add signatures to the existing ones before executing the transaction.

How can we do that? In the previous steps we instantiated the `protocol-kit` and created a transaction using the `createTransaction()` method. In order to start gathering the signatures using our service we need a calculated safe transaction hash (we used this hash as a reference for requesting data in the transaction service) and a signature (The signatures will be calculated exactly the same as in the previous steps)

```typescript
// Get the transaction hash of the safeTx
const txHash = await protocolKit.getTransactionHash(safeTx);

// Instantiate the api-kit
const apiKit = new SafeApiKit({ chainId });

// Extract the signer address and the signature
const signerAddress = (await ethAdapter1.getSignerAddress()) || '0x';
const ethSig1 = safeTx.getSignature(signerAddress) as EthSafeSignature;

// Propose the transaction
await apiKit.proposeTransaction({
  safeAddress,
  safeTransactionData: safeTx.data,
  safeTxHash: txHash,
  senderAddress: signerAddress,
  senderSignature: buildSignatureBytes([ethSig1]),
});
```

Now we have the transaction proposed and we can see it (once indexed) using Safe{Wallet} UI. But in order to execute the transaction we should gather the other signatures as well so we need the other owners to confirm the transaction.

```typescript
// Extract the signer address and the signature
const signerAddress = (await ethAdapter2.getSignerAddress()) || '0x';
const ethSig2 = safeTx.getSignature(signerAddress) as EthSafeSignature;

// Confirm the transaction
await apiKit.confirmTransaction(txHash, buildSignatureBytes([ethSig2]));
```

`owner2` confirmed the transaction is valid!!. We need one extra confirmation to match the threshold.

```typescript
// Confirm the transaction
await apiKit.confirmTransaction(
  txHash,
  buildSignatureBytes([signerSafeSig1_1])
);
await apiKit.confirmTransaction(
  txHash,
  buildSignatureBytes([signerSafeSig2_3])
); // Not really necessary as the threshold is matched
```

And we now matched the threshold!. We can confirm that retrieving the transaction and exploring the `confirmations` property

```typescript
const confirmedTx = await api.getTransaction(txHash);
```

Now, we can execute the transaction just the same we did without using the services

```typescript
// Use the retrieved confirmedTx to execute
const executedTxResponse = await safeSdk.executeTransaction(confirmedTx);
```

The transaction should be executed at this point

## Messages

Until now we were explaining how to work with transactions using the `protocol-kit` but we can work with messages as well, both plain string messages and **EIP-712** JSON ones.

We are going to explain how to generate and sign messages but not as deep as with the transactions as the concept of signatures are exactly the same and the different tables explaining the signature parts applies to the messages so in this section we are explaining how to generate signed messages using snippets. If you want to know more in dept how signatures work read the [[/Generating the signatures]] section.

### Creating the message object

We already have a `protocolKit` instance right? So let’s use it to create a new message. A message can be a plain string or a valid EIP-712 typed data structure

```json
// An example of string message
const STRING_MESSAGE = "I'm the owner of this Safe Account"

// An example of typed data message
const TYPED_MESSAGE = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallets', type: 'address[]' }
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person[]' },
      { name: 'contents', type: 'string' }
    ]
  },
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: Number(chainId),
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  },
  primaryType: 'Mail',
  message: {
    from: {
      name: 'Cow',
      wallets: [
        '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
      ]
    },
    to: [
      {
        name: 'Bob',
        wallets: [
          '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
          '0xB0B0b0b0b0b0B000000000000000000000000000'
        ]
      }
    ],
    contents: 'Hello, Bob!'
  }
}
```

```typescript
// Create the message. You can use the string or the typed JSON, it works the same
let safeMessage = protocolKit.createMessage(TYPED_MESSAGE);
```

This `safeMessage` is an `EthSafeMessage` object that stores the message data (`data`) and a map of owner - signature (`signatures`). Just the same the `EthSafeTransaction`.

```typescript
class EthSafeMessage implements SafeMessage {
  data: EIP712TypedData | string
  signatures: Map<string, SafeSignature> = new Map()
...
// Other props and methods
}
```

### Generating the message signatures

Now that we have the transaction object (`safeTx`) it’s time to add the required signatures

#### Creating a ECDSA signature

---

We are going to sign with `owner1` and `owner2`. For that we use the `signMessage()` method that takes the tx `data` and add a new signature to the `signatures` map

```typescript
safeMessage = await protocolKit.signMessage(
  safeMessage,
  SigningMethod.ETH_SIGN
);
protocolKit = await protocolKit.connect({ ethAdapter: ethAdapter2 });
safeMessage = await protocolKit.signMessage(
  safeMessage,
  SigningMethod.ETH_SIGN_TYPED_DATA_V4
);
```

Looks similar to the transaction right? That’s because the process is exactly the same and the signatures are being accumuluted in the signatures Map of the `safeMessage` object. All the previous concepts around `data`,`signatures`, `isContractSignature` … applies

#### Creating Smart contract signatures (EIP-1271)

---

**1/1 Safe Account**

We are going to sign the messafe using the 1/1 Safe. Let’s connect `owner3` and sign using the previous concepts:

```typescript
// Create a new message object
let signerSafeMessage1_1 = await createMessage(TYPED_MESSAGE);

// Connect the adapter for owner3 and specify the address of the signer Safe Account
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter3,
  safeAddress: signerSafeAddress1_1,
});

// Sign the message
signerSafeMessage1_1 = await signMessage(
  signerSafeMessage1_1,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress3_4 //Parent Safe address
);

// Build contract signature
const signerSafeMessageSig1_1 = await buildContractSignature(
  Array.from(signerSafeMessage1_1.signatures.values()),
  signerSafeAddress1_1
);

// Add the signature
safeMessage.addSignature(signerSafeMessageSig1_1);
```

**2/3 Safe Account**

The 2/3 Safe Account need at least 2 signatures in order to consider it valid. Let’s sign with the owners `owner4` and `owner5`

```typescript
// Create a new transaction object. Should produce same txHash but the signatures array is empty now
let signerSafeMessage2_3 = await createMessage(TYPED_MESSAGE);

// Connect the adapter for owner4 and specify the address of the signer Safe Account
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter4,
  safeAddress: signerSafeAddress2_3,
});

// Sign the message
signerSafeMessage2_3 = await protocolKit.signMessage(
  signerSafeMessage2_3,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress3_4
);

// Conects the adapter for owner5
protocolKit = await protocolKit.connect({ ethAdapter: ethAdapter5 });

// Sign the transaction
signerSafeMessage2_3 = await protocolKit.signMessage(
  signerSafeMessage2_3,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress
);

// Build contract signature
const signerSafeMessageSig2_3 = await buildContractSignature(
  Array.from(signerSafeMessage2_3.signatures.values()),
  signerSafeAddress2_3
);

// Add the signature
message.addSignature(signerSafeMessageSig2_3);
```

That’s it. We simplified the explanations because the concept is the same

### Validating a message signature

We can use the `isValidSignature()` method defined in the `CompatibilityFallbackHandler` [contract](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/handler/CompatibilityFallbackHandler.sol#L51-L68) to validate the signature of the previous generated message.

```typescript
import { hashSafeMessage } from '@safe-global/protocol-kit';

await protocolKit.isValidSignature(
  hashSafeMessage(MESSAGE),
  safeMessage.encodedSignatures()
);
```

This would validate if the signatures we are creating are valid.

### Utility of the messages

We cannot “execute” a message as with transactions so what can do with this?. We can “store” messages in the Safe contract and we can check for their existence later. This is useful for example for flows coming from third party apps as declaring that i’m the owner of a Safe address and that i’m authorizing the Safe contract and the dApp to work together.

Safe support this kind of messages:

- **off-chain** : This is the default method and no on-chain interaction is required
- **on-chain** : Messages [stored](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/Safe.sol#L68-L69) in the Safe contract

Safe contracts support the the signing of ~[EIP-191](https://eips.ethereum.org/EIPS/eip-191)~ compliant messages as well as ~[EIP-712](https://eips.ethereum.org/EIPS/eip-712)~ typed data messages al together with off-chain ~[EIP-1271](https://eips.ethereum.org/EIPS/eip-1271)~ validation for signatures. More about this topic [here](https://docs.safe.global/safe-smart-account/signatures/eip-1271).

### Off-chain messages (default)

Safe support off-chain messages by default. Using off-chain messages involves using the utilities we previously describe in this document and the transaction service api. There is no blockchain interaction for off-chain messages.

We are going to do somehing very similar to the `proposeTransaction()` and `confirmTransaction()` methods

#### Adding new messages using Safe services

We are going to use the `api-kit` for adding a new message

```typescript
const signerAddress = (await ethAdapter1.getSignerAddress()) || '0x';
const ethSig1 = safeMessage.getSignature(signerAddress) as EthSafeSignature;

apiKit.addMessage(safeAddress3_4, {
  message: TYPED_MESSAGE, // or STRING_MESSAGE
  signature: buildSignatureBytes([ethSig1]),
});
```

We added the message!!

#### Confirm messages by adding more signatures

Same way we did with transactions, we need to confirm the message with other owners. The `id` of the stored message is the `safeMessageHash` and we include utilities to calculate it and to add more signatures.

```typescript
// Get the safeMessageHash
const safeMessageHash = await protocolKit.getSafeMessageHash(
  hashSafeMessage(TYPED_MESSAGE)
);

// Get the signature for `owner2`
const signerAddress = (await ethAdapter2.getSignerAddress()) || '0x';
const ethSig2 = safeMessage.getSignature(signerAddress) as EthSafeSignature;

// Add the different signatures
await apiKit.addMessageSignature(
  safeMessageHash,
  buildSignatureBytes([ethSig2])
);
await apiKit.addMessageSignature(
  safeMessageHash,
  buildSignatureBytes([signerSafeMessageSig1_1])
);
await apiKit.addMessageSignature(
  safeMessageHash,
  buildSignatureBytes([signerSafeMessageSig2_3])
); // Not really necessary as the threshold is matched
```

Now we have the message signed by all the owners of the Safe. We even get over the threshold 🥳

We can check the message status using `getMessage()`

```typescript
const confirmedMessage = await apiKit.getMessage(safeMessageHash);
```

Or even better, go to the Safe{Wallet} UI to the off-chain messages section:

```
https://app.safe.global/transactions/messages?safe={myNetWorkPrefix}:{mySafeAddress}
```

### On-chain messages

The former method Safe had for messages was signing on-chain. This is a step back from off-chain messages as it implies a transaction to store the message hash in the contract and the consequent gas cost.

To sign messages on chain we need a special contract, the `SignMessageLib` library. We are using the `signMessage` method there to encode the message and execute a transaction to store it. Let’s do that.

```typescript
// Get the contract with the correct version
const signMessageLibContract = await ethAdapter1.getSignMessageLibContract({
  safeVersion: '1.4.1',
});
```

Now we need to encode it and create a transaction

```typescript
const messageHash = hashSafeMessage(MESSAGE);
const txData = signMessageLibContract.encode('signMessage', [messageHash]);
const safeTransactionData: SafeTransactionDataPartial = {
  to: customContract.signMessageLibAddress,
  value: '0',
  data: txData,
  operation: OperationType.DelegateCall,
};

const signMessageTx = await protocolKit.createTransaction({
  transactions: [safeTransactionData],
});
```

Now that we have a transaction we need the signatures for it. If you read until here you probably now how to gather them 😉, but if you started from this section … Please go to [[/Safe signatures]] and check how to produce all the required signatures. Remember, you can gather them yourself or use the transaction service.

After that, execute the transaction and you will have the message stored in the contract.

```typescript
// Gather signatures
...

// Execute tre transaction
await protocolKit.executeTransaction(signMessageTx)
```

### Validating on-chain messages

You can use the `isValidSignature()` method as well to validate on-chain messages, but the second parameter should be `0x	`

```typescript
await protocolKit.isValidSignature(messageHash, '0x');
```

This way, the method will check the stored hashes in the contract
