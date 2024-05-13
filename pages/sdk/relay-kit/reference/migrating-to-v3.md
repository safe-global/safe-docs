# Migrating to v3

This guide references the major changes between v2 and v3 to help those migrating an existing app.

## Removing adapters

We have removed the concept of adapters from the `protocol-kit` to simplify the library. Instead of using specific library adapters, we will now use an internal `SafeProvider` object to interact with the Safe. This `SafeProvider` will be created using a `provider` and a `signer`.

These change affects the `Safe4337Pack` instance creation as it was previously using an `ethAdapter` object.

```typescript
// old
const safe4337Pack = await Safe4337Pack.init({
  ethAdapter: new EthersAdapter({ ethers, signerOrProvider }),
  // ...
});
```

```typescript
// new
const safe4337Pack = await Safe4337Pack.init({
  provider: window.ethereum, // Or any compatible EIP-1193 provider,
  signer: "signerAddressOrPrivateKey", // Signer address or Signer private key. If not provider the first account of the provider will be used
  // ...
});

const safe4337Pack = await Safe4337Pack.init({
  provider: "http://rpc.url", // Or websocket
  signer: "privateKey", // Signer private key
  // ...
});
```
