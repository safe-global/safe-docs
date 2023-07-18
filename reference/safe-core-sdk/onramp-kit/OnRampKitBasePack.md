## OnRampKitBasePack

New created pack classes to be used as part of the Onramp kit need to **extend** the `OnRampKitBasePack` class. This `abstract` class bring a common interface that subclasses **must** implement and provides the specific Safe common functionality any custom implementation can take advantage on.

### Install dependencies

To use the `OnRampKitBasePack`, you need to install the `@safe-global/onramp-kit` package.

```bash
yarn add @safe-global/onramp-kit
```

### Reference

This class is used to create new packs. Any new pack should extend this class and implement the abstract methods. Extending from the `OnRampKitBasePack` class will give you access to common Safe features.

```typescript
class MyPack extends OnRampKitBasePack {
  // Implementation of the abstract methods
}
```

### Abstract methods any new pack nedd to implement

These methods are the common interface for all the packs. Check each pack documentation to get more information about the parameters and return types.

#### `init(options?)`
Provide initialization options as for example packages initializations, instantiating other classes, initializing properties, etc.

#### `open(options)`
The `open()` method initiates the interaction with the pack. It can create a widget (e.g. Stripe) or redirect to a website (e.g. Monerium).

It returns the outcome of interacting with the pack. Refer to the pack's documentation for more information.

#### `close()`
Disconnect from the provider services and clean up any data related to the current interaction.

This method is usually called when you are done using the pack, such as when you leave a page, or when you want to end the interaction with the pack.

#### `subscribe(event, handler)`
Provide a way to subscribe to events.

#### `unsubscribe(event, handler)`
Provide a way to unsubscribe from an event.

### Specific `OnRampKitBasePack` methods

These methods provide functionality associated with Safe so you can use them inside the pack implementation.

> To be defined
