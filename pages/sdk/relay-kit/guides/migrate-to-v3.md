# Migrate to v3

This guide references the major changes between v2 and v3 to help those migrating an existing app.

## Remove the adapters

We have removed the concept of adapters from the `protocol-kit` to simplify the library. Instead of using specific library adapters, we use now an internal `SafeProvider` object to interact with the Safe. This `SafeProvider` will be created using:

- An Ethereum provider, an [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compatible provider, or an RPC URL.
- An optional address of the signer that is connected to the provider or a private key. If not provided, the first account of the provider (`eth_accounts`) will be selected as the signer.

These changes affect the creation of the `Safe4337Pack` instance, as it was previously using an `ethAdapter` compatible object.

```typescript
// old
const safe4337Pack = await Safe4337Pack.init({
  ethAdapter: new EthersAdapter({ ethers, signerOrProvider }),
  // ...
})
```

```typescript
// new
const safe4337Pack = await Safe4337Pack.init({
  provider: window.ethereum, // Or any compatible EIP-1193 provider,
  signer: "signerAddressOrPrivateKey", // Signer address or signer private key
  // ...
})

const safe4337Pack = await Safe4337Pack.init({
  provider: "http://rpc.url", // Or websocket
  signer: "privateKey", // Signer private key
  // ...
})
```
