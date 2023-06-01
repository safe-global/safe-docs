## AuthKitBasePack

Any pack class implemented to be used as part of the Auth kit should **extend** the `AuthKitBasePack` class. This `abstract` class bring a common interface that subclasses **must** implement and provides the specific Safe common functionality any custom implementation could need.

### `AuthKitBasePack`

### Install

To use the `AuthKitBasePack`, you need to install the `@safe-global/auth-kit` package.

```bash
yarn add @safe-global/auth-kit
```

### Reference

This class is used to create new packs. Any new pack should extend this class and implement the abstract methods. Extending from the AuthKitBasePack class will give you access to Safe features as retrieving the associated Safes for a given Ethereum address.

```typescript
class MyPack extends AuthKitBasePack {
  // ... Implementing the abstract methods
}
```

### Abstract methods any new pack should implement

These methods are the common interface for all the packs. Check each pack documentation to get more information about the parameters and return types.

#### `init(options?)`
Provide initialization options as for example packages initializations, instantiating other classes, initializing properties, etc.

#### `signIn(): authKitSignInData`
Provide a mechanism to connect to the provider services and return as a result a Ethereum address we will use as a signer along with the associated Safe addresses.

#### `signOut()`
Disconnect from the provider services and clean up any data related to the current user.

#### `getProvider(): web3Provider`
Return a Web3 provider we can use to interact with the blockchain (`web3` or `ethers` for example).

#### `getUserInfo(): userInfo`
Return the user information as a JSON object.

#### `subscribe(event, handler)`
Provide a way to subscribe to events

#### `unsubscribe(event, handler)`
Provide a way to unsubscribes from an event.

### Specific `AuthKitBasePack` methods

These methods provide functionality associated with Safe so you can use them inside the pack implementation.

#### `getAddress(): address`
This method returns the Ethereum address extracted from the provider retrieved by `getProvider()`.

**Returns**
- `address`: The Ethereum address extracted from the provider.

#### `getSafes(txServiceUrl): safes[]`
This method returns the list of Safes associated addresses by calling internally the `getAddress()` method and then using the api-kit to retrieve the Safes associated with the signer.

**Params**
- `txServiceUrl`: The transaction service url to use to retrieve the Safes associated with the signer.

**Returns**
- `safes[]`: The list of Safes associated with the signer.




