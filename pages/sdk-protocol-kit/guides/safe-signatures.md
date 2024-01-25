# Safe Signatures

Understanding and generating signatures can be challenging. The **Safe{Core} SDK** provides a set of utilities to use signatures with Safe. This guide covers how signatures work and how to generate them using the `@safe-global/protocol-kit` package.

## Setting up the example Safe Account

A Safe account can be configured with different values for the threshold and different types of owner. An owner can be any Ethereum address, such as:

- Externally-owned account (EOA)
- An smart contract that implements [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) for signature validation, such as another Safe.

When a Safe owner is an EOA it will generate generate an ECDSA signature to approve a Safe transaction. When a Safe owner is a smart account, the signature algorithm will depends on the implementation of the smart account.

In this guide we will use the following Safe account setup:

- `safe3_4`: 3/4 Safe (3 signatures required out of 4 owners)
  - `owner1`
  - `owner2`
  - `signerSafe1_1`: 1/1 Safe Account as child owner
    - `owner3`
  - `signerSafe2_3`: 2/3 Safe Account as another child owner
    - `owner4`
    - `owner5`

All the owners are Ethereum addresses. Here are the addresses for this example:

| Who                | Address                                    |
| ------------------ | ------------------------------------------ |
| **safe3_4** | 0xb3b3862D8e38a1E965eb350B09f2167B2371D652 |
| **owner1**         | 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 |
| **owner2**         | 0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0 |
| **signerSafe1_1**  | 0x215033cdE0619D60B7352348F4598316Cc39bC6E |
| **owner3**         | 0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b |
| **signerSafe2_3**  | 0xf75D61D6C27a7CC5788E633c1FC130f0F4a62D33 |
| **owner4**         | 0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d |
| **owner5**         | 0xd03ea8624C8C5987235048901fB614fDcA89b117 |

## Transactions

### Creating the transaction object

We can sign transactions using the `protocol-kit` by creating an instance of the `Safe` class:

```typescript
import Safe from '@safe-global/protocol-kit';

// You can use any compatible adapter, such as Web3Adapter or EthersAdapter
const protocolKit = await Safe.create({
  ethAdapter: ethAdapter1,
  safeAddress: safe3_4,
});
```

The `ethAdapter1` is bound to `owner1`. In the examples provided in this article, we will have 5 adapters, each one bound to an owner.

| Adapter     | Signer |
| ----------- | -------- |
| ethAdapter1 | owner1   |
| ethAdapter2 | owner2   |
| ethAdapter3 | owner3   |
| ethAdapter4 | owner4   |
| ethAdapter5 | owner5   |

After obtaining the `protocolKit` instance, we can use `createTransaction()` to generate a transaction object.

```typescript
// Create the transaction. Send 0.01 ETH
const safeTransactionData: SafeTransactionDataPartial = {
  to: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
  value: '100000000000000000', // 0.01 ETH
  data: '0x',
};

let safeTx = await protocolKit.createTransaction({
  transactions: [safeTransactionData],
});
```

The `safeTx` object is an instance of the `EthSafeTransaction` class, which stores the Safe transaction data and a map of the signatures from the Safe owners.

```typescript
class EthSafeTransaction implements SafeTransaction {
  data: SafeTransactionData
  signatures: Map<string, SafeSignature> = new Map()
  ...
  // Other properties and methods
}
```

### Generating transaction signatures

Once we have the `safeTx` transaction object, the necessary signatures can be added to it.

#### Creating an ECDSA signature

---

We will sign with `owner1` and `owner2` using the `signTransaction()` method. This method add new signatures to the `signatures` map by using the transaction `data` as input.

It's possible to use several signing methods, such as `ETH_SIGN` (eth_sign), `ETH_SIGN_TYPED_DATA_V4` (eth_signTypedData_v4), ...etc. The default signing method is `ETH_SIGN_TYPED_DATA_V4`.

```typescript
safeTx = await protocolKit.signTransaction(safeTx, SigningMethod.ETH_SIGN);
protocolKit = await protocolKit.connect({ ethAdapter: ethAdapter2 }); // Connect another owner
safeTx = await protocolKit.signTransaction(
  safeTx,
  SigningMethod.ETH_SIGN_TYPED_DATA_V4
);
```

In this snippet, we add the signature for `owner1`. Then, we use the `connect()` method to connect the `owner2` adapter and sign again to add the second signature.

If we examine the `safeTx` object at this point, we should see something similar to the following:

```javascript
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

The `data` prop in the `signatures` map represents the concrete signature. The `isContractSignature` flag (_false_) indicates if the signature is an Ethereum signature or a Contract signature (A signer Safe Account).

An ECDSA signature is composed of two 32-byte integers (r, s) and an extra byte for recovery id (v), making a total of 65 bytes. In hexadecimal string format, each byte is represented by 2 characters. Hence, a 65-byte Ethereum signature will be 130 characters long. Including the '0x' prefix commonly used with signatures, the total character count for such a signature would be 132. For a more detailed explanation, you can refer to [this link](https://docs.safe.global/safe-smart-account/signatures) for more information.

> To represent a byte (8 bits) in hexadecimal, you need 2 characters. Each hexadecimal character represents 4 bits. Therefore, 2 hexadecimal characters (2 x 4 bits) are able to represent a byte (8 bits).

The final part of the signature, either `1f` or `1c`, indicates the signature type.

> Safe supports the following V values:
>
> - 0: Contract signature
> - 1: Approved hash
> - {27, 28} + 4: Ethereum adjusted ECDSA recovery byte for EIP-191 signed message
>   It's important that for the EIP-191 signed message the V is adjusted to the ECDSA V + 4. If the generated value is 28 and you adjust it to 0x1f, the signature verification will fail, it should be 0x20 (28+4=32) instead, so, if v > 30 then default v (27,28) has been adjusted for eth_sign flow. This is automatically done in the SDK
> - Other: Ethereum adjusted ECDSA recovery byte for raw signed hash

The hexadecimal value `1f` equals to the decimal number 31. Because the decimal value is greater than 30, it [indicates to the Safe smart contract]()(https://github.com/safe-global/safe-smart-account/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/Safe.sol#L344-L347) that the signature is an `eth_sign`.

The hexadecimal value `1c` equals to the decimal number 28, indicating that the signature is a typed data signature. For instance, in the case of the initial signature:

`0x969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b1261f`:

| Type           | Bytes | Value                                                                                                                            | Description             |
| -------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Hex            | 1     | 0x                                                                                                                               | Hex string characters   |
| Signature      | 64    | 969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b126 | Signature bytes         |
| Signature Type | 1     | 1f                                                                                                                               | 1f hex is 31 in decimal |

#### Creating Smart contract signatures

---

**1/1 Safe Account**

The smart contract signatures supported by Safe differ from regular ECDSA signatures. We will use the special method `SigningMethod.SAFE_SIGNATURE` to generate these kind of signatures.

To start signing with the 1/1 Safe, we need the adapter for `owner3` and the new `safeAddress` for the signature. The new `safeAddress` is associated with the child Safe Account. Let's connect the adapter and safe, and continue with the signing process:

```typescript
// Create a new transaction object with an empty signatures array. The txHash should remain the same. You can copy the safeTx object and remove the contents of the signatures array
let signerSafeTx1_1 = await protocolKit.createTransaction({
  transactions: [safeTransactionData],
});

// Connect the adapter for owner3 and provide the address of the signer Safe Account
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter3,
  safeAddress: signerSafe1_1,
});

// Sign the transaction
signerSafeTx1_1 = await protocolKit.signTransaction(
  signerSafeTx1_1,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress3_4 // Parent Safe address
);
```

> When signing with a child Safe Account, it's important to specify the parent Safe address. The parent Safe address is used internally to generate the signature based on the version of the contracts you are using

Once signed, we will have a transaction object (`signerSafeTx1_1`) similar to this one:

```javascript
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

Inside the signatures map, there is a regular ECDSA signature (`isContractSignature=false`). We can use this signature to generate an Safe Account smart contract compatible signature. This can be achieved by using the `buildContractSignature()` utility method, which can be found [here](https://github.com/safe-global/safe-core-sdk/blob/cce519b4204b2c54ae0c3d2295ab6031332c0fe7/packages/protocol-kit/src/utils/signatures/utils.ts#L139-L150). This method takes an array of signatures and output another signature that's ready to be used with Safe Accounts.

```typescript
const signerSafeSig1_1 = await buildContractSignature(
  Array.from(signerSafeTx1_1.signatures.values()),
  signerSafe1_1
);
```

The contract signature will look like this:

```javascript
EthSafeSignature {
  signer: '0x215033cdE0619D60B7352348F4598316Cc39bC6E',
  data: '0x5edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f',
  isContractSignature: true
}
```

The main changes from the one in the `EthSafeTransaction` object are the following ones:

- Specify the correct `signer` (the Safe owner Account)
- Set `isContractSignature` to `true`
- Build the `data` by considering all the individual signatures of the child Safe

After signing the contract, we can generate the final contract compatible with Safe Accounts using the `buildSignatureBytes()` method. This method is also used internally in the `buildContractSignature()` method. You can find the implementation of the `buildSignatureBytes()` method [here](https://github.com/safe-global/safe-core-sdk/blob/cce519b4204b2c54ae0c3d2295ab6031332c0fe7/packages/protocol-kit/src/utils/signatures/utils.ts#L152-L189).

Let’s examine the output of the do `buildSignatureBytes()` method. We can log it:

```typescript
console.log(buildSignatureBytes([signerSafeSig1_1])
```

The output will be

```
0x000000000000000000000000215033cdE0619D60B7352348F4598316Cc39bC6E00000000000000000000000000000000000000000000000000000000000000410000000000000000000000000000000000000000000000000000000000000000415edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f
```

Let's break down this signature into parts:

| Type             | Bytes | Value                                                                                                                              | Description                                                                                                                                      |
| ---------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hex              | 1     | 0x                                                                                                                                 | Hex string characters                                                                                                                            |
| Verifier         | 32    | 000000000000000000000000215033cdE0619D60B7352348F4598316Cc39bC6E                                                                   | Padded address of the contract that implements the EIP-1271 interface to verify the signature. The Safe signer address                           |
| Data position    | 32    | 0000000000000000000000000000000000000000000000000000000000000041                                                                   | Start position of the signature data (offset relative to the beginning of the signature data). 41 hex is 65 in decimal                           |
| Signature Type   | 1     | 00                                                                                                                                 | 00 for [Safe Accounts](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/Safe.sol#L322-L336) |
| Signature Length | 32    | 0000000000000000000000000000000000000000000000000000000000000041                                                                   | The length of the signature. 41 hex is 65 in decimal                                                                                             |
| Signature        | 65    | 5edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f | Signature bytes that are verified by the signature verifier                                                                                      |

This is what an **EIP-1271** contract signature for Safe contracts looks like. Now that we've explained this lengthy string, let's add the signature to the original transaction.

```typescript
safeTx.addSignature(signerSafeSig1_1);
```

**2/3 Safe Account**

The 2/3 Safe Account requires a minimum of 2 signatures to be considered valid. Let's sign it with `owner4` and `owner5`.

```typescript
// Create a new transaction object
let signerSafeTx2_3 = await protocolKit.createTransaction({
  transactions: [safeTransactionData],
});

// Connect the adapter for owner4 and specify the address of the signer Safe Account
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter4,
  safeAddress: signerSafeAddress2_3,
});

// Sign the transaction with owner4
signerSafeTx2_3 = await protocolKit.signTransaction(
  signerSafeTx2_3,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress3_4
);

// Connect the adapter for owner5
protocolKit = await protocolKit.connect({ ethAdapter: ethAdapter5 });

// Sign the transaction with owner5
signerSafeTx2_3 = await protocolKit.signTransaction(
  signerSafeTx2_3,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress
);
```

Once signed, we will have a transaction object like this one:

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

We now have two signatures from the owners, `owner4` and `owner5`. By following the same process, we can create the contract signature and examine the result.

```typescript
const signerSafeSig2_3 = await buildContractSignature(
  Array.from(signerSafeTx2_3.signatures.values()),
  signerSafe2_3
)
console.log(buildSignatureBytes([signerSafeSig2_3])
```

The output will be:

```
0x000000000000000000000000f75D61D6C27a7CC5788E633c1FC130f0F4a62D330000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000082023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520d3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f
```

Let's break down this signature into parts again:

| Type             | Bytes | Value                                                                                                                                                                                                                                                                | Description                                                                                                                                      |
| ---------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hex              | 1     | 0x                                                                                                                                                                                                                                                                   | Hex string characters                                                                                                                            |
| Verifier         | 32    | 000000000000000000000000f75D61D6C27a7CC5788E633c1FC130f0F4a62D33                                                                                                                                                                                                     | Padded address of the contract that implements the EIP-1271 interface to verify the signature. The Safe signer address                           |
| Data position    | 32    | 0000000000000000000000000000000000000000000000000000000000000041                                                                                                                                                                                                     | Start position of the signature data (offset relative to the beginning of the signature data). 41 hex is 65 in decimal                           |
| Signature Type   | 1     | 00                                                                                                                                                                                                                                                                   | 00 for [Safe Accounts](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/Safe.sol#L322-L336) |
| Signature Length | 32    | 0000000000000000000000000000000000000000000000000000000000000082                                                                                                                                                                                                     | The length of the signature. 82 hex is 130 in decimal                                                                                            |
| Signature        | 130   | 023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520d3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f | Signature bytes that are verified by the signature verifier (130 bytes are represented by 260 characters in an hex string)                       |

The table looks very similar to the previous one, but there are two changes:

- The _signature length_ has doubled because this Safe needs two signatures.
- The _signature_ value is a concatenation of the two regular signatures.

We're finished. Let's add the signature to the original transaction.

```typescript
safeTx.addSignature(signerSafeSig2_3);
```

🚀🚀🚀 We're now done!!, we've signed with all the owners. We even have one more owner than the required threshold of 3 💃🏻, but that's okay. Now, let's take a look at the final structure of the `safeTx` object.

```javascript
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

The transaction includes four signatures: two regular and two contract signatures. Since the threshold is three, we can even remove one signature 😉. Nevertheless, the transaction is prepared for sending to the contract and execution.

### Executing the transaction

To start, connect to the original safe and the desired adapter. Ensure sufficient funds are available in the underlying owner account to execute the transaction. In the previous step, we connected the `protocolKit` instance to the 2/3 Safe Account. Once connected, proceed with executing the transaction.

```typescript
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter1,
  safeAddress,
});
const transactionResponse = await protocolKit.executeTransaction(safeTx);
```

When we call the `executeTransaction()` method, it internally uses the [`safeTx.encodedSignatures()`](https://github.com/safe-global/safe-core-sdk/blob/cce519b4204b2c54ae0c3d2295ab6031332c0fe7/packages/protocol-kit/src/adapters/ethers/contracts/Safe/SafeContractEthers.ts#L159-L171) function, which in turn calls [`buildSignatureBytes()`](<(https://github.com/safe-global/safe-core-sdk/blob/cce519b4204b2c54ae0c3d2295ab6031332c0fe7/packages/protocol-kit/src/utils/transactions/SafeTransaction.ts#L24-L26)>) with the four signatures generated by the different owners.

Let’s log that.

```typescript
console.log(safeTx.encodedSignatures()); // Call buildSignatureBytes()
```

```
0x000000000000000000000000215033cdE0619D60B7352348F4598316Cc39bC6E000000000000000000000000000000000000000000000000000000000000010400969308e2abeda61a0c9c41b3c615012f50dd7456ca76ea39a18e3b975abeb67f275b07810dd59fc928f3f9103e52557c1578c7c5c171ffc983afa5306466b1261f000000000000000000000000f75D61D6C27a7CC5788E633c1FC130f0F4a62D330000000000000000000000000000000000000000000000000000000000000165004d63c79cf9d743782bc31ad58c1a316020b39839ab164caee7ecac9829f685cc44ec0d066a5dfe646b2ffeeb37575df131daf9c96ced41b8c7c4aea8dc5461801c00000000000000000000000000000000000000000000000000000000000000415edb6ffe67dd935d93d07c634970944ba0b096f767b92018ad635e8b28effeea5a1e512f1ad6f886690e0e30a3fae2c8c61d3f83d24d43276acdb3254b92ea5b1f0000000000000000000000000000000000000000000000000000000000000082023d1746ed548e90f387a6b8ddba26e6b80a78d5bfbc36e5bfcbfd63e136f8071db6e91c037fa36bde72159138bbb74fc359b35eb515e276a7c0547d5eaa042520d3e6565e5590641db447277243cf24711dce533cfcaaf3a64415dcb9fa309fbf2de1ae4709c6450752acc0d45e01b67b55379bdf4e3dc32b2d89ad0a60c231d61f
```

This is the final signature we sent to the contract. The signatures are concatenated and sorted by signer address. Let’s decompose it.

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

At this point, The transaction should be executed on-chain and the process is finished.

### Proposing transactions using Safe Services

Until now, in the previous examples, we used the `protocol-kit` utilities to create and compose a signature for executing a transaction with Safe. This process can be done entirely on-chain without the need for any external service. However, in a real-world application, you would typically collect signatures from multiple Ethereum addresses (wallets), and there will be private keys belonging to different users. To handle this situation, you can either develop your own system (such as an API or services) to store each signature before sending it along the transaction to the blockchain (although we don't recommend it 😰), or you can utilize Safe services for this purpose 🚀.

We've already deployed Safe services on the main chains. More information can be found in:

- [Safe Core API documentation](https://docs.safe.global/safe-core-api/supported-networks).
- [Safe Transaction Service](https://docs.safe.global/safe-core-api/service-architecture/safe-transaction-service)
- [Transaction Service Swagger](https://safe-transaction-mainnet.safe.global/)

You can use our APIs directly to collect signatures. Alternatively, you can use the `api-kit` package, which uses the Transaction Service under the hood. With the `api-kit`, you can propose transactions and add signatures to existing ones before execution.

How can we do that? In the previous steps we instantiated the `protocol-kit` and created a transaction using the `createTransaction()` method. In order to start collecting signatures using our services we'll need:

- A calculated safe transaction hash. We used this hash as a reference (id) for requesting data in the Transaction Service
- The signature. Can be calculated in the same way as in the previous steps.

```typescript
// Get the transaction hash of the safeTx
const txHash = await protocolKit.getTransactionHash(safeTx);

// Instantiate the api-kit
const apiKit = new SafeApiKit({ chainId }); // Use the chainId where you have the Safe Account deployed

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

Now that we've the proposed transaction, we can view it in the Safe{Wallet} UI. However, to execute the transaction, we need the other owners to confirm it by providing their signatures.

```typescript
// Extract the signer address and the signature
const signerAddress = (await ethAdapter2.getSignerAddress()) || '0x';
const ethSig2 = safeTx.getSignature(signerAddress) as EthSafeSignature;

// Confirm the transaction
await apiKit.confirmTransaction(txHash, buildSignatureBytes([ethSig2]));
```

`owner2` has confirmed that the transaction is valid at this point! We only need one more confirmation to meet the configured threshold.

```typescript
// Confirm the transaction with the 1/1 signer Safe
await apiKit.confirmTransaction(
  txHash,
  buildSignatureBytes([signerSafeSig1_1])
);

// Confirm the transaction with the 2/3 signer Safe
// It's not really necessary as the threshold is matched at this point
await apiKit.confirmTransaction(
  txHash,
  buildSignatureBytes([signerSafeSig2_3])
);
```

We've now reached the threshold! We can check it by retrieving the transaction and examine the `confirmations` property.

```typescript
const confirmedTx = await api.getTransaction(txHash);
// Examine the `confirmedTx.confirmations` property
```

Now, we can execute the transaction just as we did without using the services.

```typescript
// Use the retrieved confirmedTx to execute
const executedTxResponse = await safeSdk.executeTransaction(confirmedTx);
```

The transaction should be executed now and after the Transaction Service indexes it we should be able to see it using the Safe{Wallet} UI.

## Messages

Previously, we explained how to work with transactions using the `protocol-kit`. However, we can also work with messages, including plain string messages and **EIP-712** JSON messages.

In this section, we will explain how to generate and sign messages. The concept of signatures is the same as with transactions, so the tables explaining the signature parts also apply to messages. We will focus on generating signed messages using snippets. For a more detailed understanding of how signatures work, please refer to the **Generating the signatures** section above.

### Creating the message object

We already have a `protocolKit` instance right?, let’s use it to create a new message. A message can be a plain string or a valid EIP-712 typed data structure

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

Let's compose the message. You can use either the string or the typed JSON format:

```typescript
let safeMessage = protocolKit.createMessage(TYPED_MESSAGE);
```

The `safeMessage` is an object of type `EthSafeMessage` that contains the message data (`data`) and a map of owner-signature pairs (`signatures`). It's similar to the `EthSafeTransaction`.

```typescript
class EthSafeMessage implements SafeMessage {
  data: EIP712TypedData | string
  signatures: Map<string, SafeSignature> = new Map()
...
// Other props and methods
}
```

### Generating the message signatures

Now that we've the transaction object (`safeTx`), it's time to collect signatures.

#### Creating a ECDSA signature

---

We're going to sign with `owner1` and `owner2`. For that we use the `signMessage()` method that takes the transaction `data` and add a new signature to the `signatures` map.

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

It feels very similar to the transactions, right? That's because the process is basically the same and the signatures are being accumulated in the signatures Map of the `safeMessage` object. The previous concepts related to `data`, `signatures`, and `isContractSignature` still apply.

#### Creating Smart contract signatures (EIP-1271)

---

**1/1 Safe Account**

We will sign the message using the 1/1 Safe. Connect `owner3` and sign using the concepts explained earlier.

```typescript
// Create a new message object
let signerSafeMessage1_1 = await createMessage(TYPED_MESSAGE);

// Connect the adapter for owner3 and specify the address of the signer Safe Account
protocolKit = await protocolKit.connect({
  ethAdapter: ethAdapter3,
  safeAddress: signerSafe1_1,
});

// Sign the message
signerSafeMessage1_1 = await signMessage(
  signerSafeMessage1_1,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress3_4 // Parent Safe address
);

// Build contract signature
const signerSafeMessageSig1_1 = await buildContractSignature(
  Array.from(signerSafeMessage1_1.signatures.values()),
  signerSafe1_1
);

// Add the signature
safeMessage.addSignature(signerSafeMessageSig1_1);
```

**2/3 Safe Account**

The 2/3 Safe Account requires a minimum of 2 signatures to be considered valid. Let's sign it with the owners `owner4` and `owner5`.

```typescript
// Create a new message object
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

// Connect the adapter for owner5
protocolKit = await protocolKit.connect({ ethAdapter: ethAdapter5 });

// Sign the message
signerSafeMessage2_3 = await protocolKit.signMessage(
  signerSafeMessage2_3,
  SigningMethod.SAFE_SIGNATURE,
  safeAddress3_4
);

// Build contract signature
const signerSafeMessageSig2_3 = await buildContractSignature(
  Array.from(signerSafeMessage2_3.signatures.values()),
  signerSafe2_3
);

// Add the signature
message.addSignature(signerSafeMessageSig2_3);
```

That's it. We simplified the explanations because the concept remains the same.

### Validating a message signature

We can use the `isValidSignature()` method defined in the `CompatibilityFallbackHandler` [contract](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/handler/CompatibilityFallbackHandler.sol#L51-L68) to validate the signature of the previous generated message.

```typescript
import { hashSafeMessage } from '@safe-global/protocol-kit';

await protocolKit.isValidSignature(
  hashSafeMessage(MESSAGE),
  safeMessage.encodedSignatures()
);
```

This would validate the validity of the signatures we create.

### What are the messages about ?

We can't execute a message like transactions. Instead, we can store messages in the Safe contract and later check for their existence. This is useful, for example, for flows from third-party apps. It declares ownership of a Safe address and authorizes the Safe contract and the dApp to collaborate.

Safe supports these two kinds of messages:

- **Off-chain**: This is the default method and doesn't require any on-chain interaction.
- **on-chain** : Messages [stored](https://github.com/safe-global/safe-contracts/blob/f03dfae65fd1d085224b00a10755c509a4eaacfe/contracts/Safe.sol#L68-L69) in the Safe contract

Safe Accounts support signing of [EIP-191](https://eips.ethereum.org/EIPS/eip-191) compliant messages as well as [EIP-712](https://eips.ethereum.org/EIPS/eip-712) typed data messages all together with off-chain [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) validation for signatures. More about this topic [here](https://docs.safe.global/safe-smart-account/signatures/eip-1271).

### Off-chain messages (default)

By default, Safe supports off-chain messages. To use off-chain messages, you need to use the utilities described in this document and the Transaction Service API. Off-chain messages don't require any interaction with the blockchain.

We mentioned the utility of storing messages in the contract. Off-chain messages have the same purpose, but they're stored in the Transaction Service. It stores the messages and signatures in a database. It's a centralized service, but it's open-source and can be deployed by anyone. The Transaction Service is used by the Safe{Wallet} UI to store messages and signatures by default.

We will perform a task similar to the `proposeTransaction()` and `confirmTransaction()` methods.

#### Adding new messages using Safe services.

We will use the `api-kit` to add a new message. The process is similar to the one we used for transactions. We need to calculate the `safeMessageHash` and add the message to the service.

```typescript
const signerAddress = (await ethAdapter1.getSignerAddress()) || '0x';
const ethSig1 = safeMessage.getSignature(signerAddress) as EthSafeSignature;

apiKit.addMessage(safeAddress3_4, {
  message: TYPED_MESSAGE, // or STRING_MESSAGE
  signature: buildSignatureBytes([ethSig1]),
});
```

We've added the message!

#### Confirm messages by adding additional signatures

We should confirm the message with other owners, just like we did with transactions. The `id` of the stored message is the `safeMessageHash`, and we've utilities available to calculate it and add more signatures.

```typescript
// Get the safeMessageHash
const safeMessageHash = await protocolKit.getSafeMessageHash(
  hashSafeMessage(TYPED_MESSAGE)
);

// Get the signature for owner2
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

// The threshold has already been matched, so it's not necessary.
await apiKit.addMessageSignature(
  safeMessageHash,
  buildSignatureBytes([signerSafeMessageSig2_3])
);
```

Now we've the message signed by all Safe owners. We've even "crossed the threshold" 🥳

We can check the status of the message by using the `getMessage()` function.

```typescript
const confirmedMessage = await apiKit.getMessage(safeMessageHash);
```

Or, better yet, visit the SafeWallet UI and navigate to the off-chain messages section.

```
https://app.safe.global/transactions/messages?safe={myNetWorkPrefix}:{mySafeAddress}
```

### On-chain messages

The previous method used by Safe for messages involved on-chain signing. This is less efficient than off-chain messages because it requires a transaction to store the message hash in the contract, resulting in additional gas costs.

We require a special contract, the `SignMessageLib` library, to sign messages on the chain. In this library, we use the `signMessage` method in the contract to encode the message and execute a transaction for storing it. Let's proceed with this process:

```typescript
// Get the contract with the correct version
const signMessageLibContract = await ethAdapter1.getSignMessageLibContract({
  safeVersion: '1.4.1',
});
```

Now we need to encode it and create a transaction:

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

Now that we've a transaction, we need its signatures. If you've read this far, you probably know how to gather them 😉. If you started from this section, please go to the beginning and learn how to generate all the necessary signatures. Remember, you can gather them on your own or use the Transaction Service.

After that, execute the transaction and you will have the message stored in the contract.

```typescript
// Gather signatures using signTransaction()
...

// Execute tre transaction
await protocolKit.executeTransaction(signMessageTx)
```

### Validating on-chain messages

You can also use the `isValidSignature()` method to validate on-chain messages. However, make sure to pass `0x` as the second parameter.

```typescript
await protocolKit.isValidSignature(messageHash, '0x');
```

This way, the method will check the stored hashes in the contract.
