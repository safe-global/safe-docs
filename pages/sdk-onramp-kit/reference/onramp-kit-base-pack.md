# OnRampKitBasePack

To be used as part of the Onramp Kit, new packs need to extend the `OnRampKitBasePack` class. This abstract class provides a common interface that subclasses must implement. It provides the specific Safe common functionality that any custom implementation can leverage.

## Install dependencies

To use the `OnRampKitBasePack`, you need to install the `@safe-global/onramp-kit` package.

```bash
yarn add @safe-global/onramp-kit
```

## Reference

This class is used to create new packs. Any new pack should extend this class and implement the abstract methods. Extending from the `OnRampKitBasePack` class will give the subclass access to common Safe features.

```typescript
class MyPack extends OnRampKitBasePack {
  // Implementation of the abstract methods
}
```

## Abstract methods that Onramp packs must implement

These methods are the common interface for all the Onramp packs. Check each pack's documentation to get more details.

### init(options?)

Provides the initialization options for the required packages, classes and properties.

### open(options)

Initiates the interaction with the pack. It can create a widget (for example Stripe) or redirect to a website (for example Monerium).

It returns the outcome of interacting with the pack.

### close()

Disconnects the provider services and cleans up any data related to the current interaction.

This method is usually called when you are done using the pack, such as when you leave a page, or when you want to end the interaction with the pack.

### subscribe(event, handler)

Provides a way to subscribe to events.

### unsubscribe(event, handler)

Provides a way to unsubscribe from an event.

## Specific `OnRampKitBasePack` methods

These methods provide the functionality associated with Safe so they can be used in the implementation of the packs.

> To be defined
