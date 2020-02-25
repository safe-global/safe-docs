---
id: docs5
title: Signatures 
sidebar_label: Signatures
---
The Safe supports different types of signatures. All signatures are combined into a single <span style="color:#DB3A3D">`bytes`</span>  and transmitted to the contract when a transaction should be executed. 

## Encoding

Each signature has a constant length of 65 bytes. If more data is necessary it can be appended to the end of concatenated constant data of all signatures. The position is encoded into the constant length data.

Constant part per signature: <span style="color:#DB3A3D">`{(max) 64-bytes signature data}{1-byte signature type}`</span> 

All the signatures are sorted by the signer address and concatenated.


### ECDSA Signature
<span style="color:#DB3A3D">`31 > signature type > 26`</span>

To be able to have the ECDSA signature without the need of additional data we use the signature type byte to encode <span style="color:#DB3A3D">`v`</span>. 

#### Constant part:
<span style="color:#DB3A3D">`{32-bytes r}{32-bytes s}{1-byte v}`</span>

<span style="color:#DB3A3D">`r`</span>, <span style="color:#DB3A3D">`s`</span> and <span style="color:#DB3A3D">`v`</span> are the required parts of the ECDSA signature to recover the signer.

### <span style="color:#DB3A3D">`eth_sign`</span> signature
<span style="color:#DB3A3D">`signature type > 30`</span>

To be able to use <span style="color:#DB3A3D">`eth_sign`</span> we need to take the parameters <span style="color:#DB3A3D">`r`</span>, <span style="color:#DB3A3D">`s`</span> and <span style="color:#DB3A3D">`v`</span> from calling <span style="color:#DB3A3D">`eth_sign` </span>and set<span style="color:#DB3A3D"> <span style="color:#DB3A3D">`v = v + 4`</span>

#### Constant part:
<span style="color:#DB3A3D">`{32-bytes r}{32-bytes s}{1-byte v}`</span>

<span style="color:#DB3A3D">`r`</span>, <span style="color:#DB3A3D">`s`</span> and <span style="color:#DB3A3D">`v`</span>are the required parts of the ECDSA signature to recover the signer.
<span style="color:#DB3A3D">`v`</span> will be substracted by <span style="color:#DB3A3D">`4`</span> to calculate the signature.


### Contract Signature (EIP-1271)
<span style="color:#DB3A3D">`signature type == 0`</span>

#### Constant part:
<span style="color:#DB3A3D">`{32-bytes signature verifier}{32-bytes data position}{1-byte signature type}`</span>

**Signature verifier** - Padded address of the contract that implements the EIP 1271 interface to verify the signature

**Data position** - Position of the start of the signature data (offset relative to the beginning of the signature data)

**Signature type** - 0

#### Dynamic part (solidity <span style="color:#DB3A3D">`bytes`</span>):
<span style="color:#DB3A3D">`{32-bytes signature length}{bytes signature data}`</span>

**Signature data** - Signature bytes that are verified by the signature verifier

The method <span style="color:#DB3A3D">`signMessage`</span> can be used to mark a message as signed on-chain.


### Pre-Validated Signatures
<span style="color:#DB3A3D">`signature type == 1`</span>

#### Constant Part:
<span style="color:#DB3A3D">`{32-bytes hash validator}{32-bytes ignored}{1-byte signature type}`</span>

**Hash validator** - Padded address of the account that pre-validated the hash that should be validated. The Safe keeps track of all hashes that have been pre validated. This is done with a **mapping address to mapping of bytes32 to boolean** where it is possible to set a hash as validated by a certain address (hash validator). To add an entry to this mapping use <span style="color:#DB3A3D">`approveHash`</span>. Also if the validator is the sender of transaction that executed the Safe transaction it is **not** required to use <span style="color:#DB3A3D">`approveHash`</span> to add an entry to the mapping. (This can be seen in the [Team Edition tests](https://github.com/gnosis/safe-contracts/blob/v1.0.0/test/gnosisSafeTeamEdition.js))

**Signature type** - 1


## Examples

Assuming that three signatures are required to confirm a transaction where one signer uses an EOA to generate a ECDSA signature, another a contract signature and the last a pre-validated signature:

We assume that the following addresses generate the following signatures:
1. <span style="color:#DB3A3D">`0x3`</span> (EOA address) ->  <span style="color:#DB3A3D">`bde0b9f486b1960454e326375d0b1680243e031fd4fb3f070d9a3ef9871ccfd5`</span> (r) + <span style="color:#DB3A3D">`7d1a653cffb6321f889169f08e548684e005f2b0c3a6c06fba4c4a68f5e00624`</span> (s) + <span style="color:#DB3A3D">`1c`</span> (v)
2. <span style="color:#DB3A3D">`0x1`</span> (EIP-1271 validator contract address) ->  <span style="color:#DB3A3D">`0000000000000000000000000000000000000000000000000000000000000001`</span> (address) + <span style="color:#DB3A3D"> `00000000000000000000000000000000000000000000000000000000000000c3`</span> (dynamic position) + <span style="color:#DB3A3D">`00`</span> (signature type)
    * The contract takes the following <span style="color:#DB3A3D">`bytes`</span> (dynamic part) for verification <span style="color:#DB3A3D">`00000000000000000000000000000000000000000000000000000000deadbeef`</span>
3. <span style="color:#DB3A3D">`0x2`</span> (Validator address) ->  <span style="color:#DB3A3D">`0000000000000000000000000000000000000000000000000000000000000002`</span> (address) +<span style="color:#DB3A3D">`0000000000000000000000000000000000000000000000000000000000000000`</span> (padding - not used) + <span style="color:#DB3A3D">`01`</span> (signature type)

The constant parts need to be sorted so that the recovered signers are sorted **ascending** (natural order) by address (not checksummed).

The signatures bytes used for <span style="color:#DB3A3D">`execTransaction`</span> would therefore be the following:
```java
"0x" + 
"000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c300" + // encoded EIP-1271 signature
"0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000001" + // encoded pre-validated signature
"bde0b9f486b1960454e326375d0b1680243e031fd4fb3f070d9a3ef9871ccfd57d1a653cffb6321f889169f08e548684e005f2b0c3a6c06fba4c4a68f5e006241c" + // encoded ECDSA signature
"000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000deadbeef"     // length of bytes + data of bytes
```

