# Plugins 

Plugins allow to add any arbitrary logic to an [Account](../accounts.md) such as recovery mechanisms, session keys, and automations.

Plugins can trigger transactions on an Account via the [Manager](../manager.md).

{% hint style="danger" %}
The Safe{Core} Protocol is still in alpha version and it should only be used in test networks until there is a production release.
{% endhint %}

Plugins must implement the following interface:

```typescript
interface ISafeProtocolPlugin is IERC165 {
    function name() external view returns (string memory name);

    function version() external view returns (string memory version);

    function metadataProvider() external view returns (uint256 providerType, bytes memory location);

    function requiresRootAccess() external view returns (bool requiresRootAccess);
}
```

The `name` function returns the name of the Plugin.

The `version` function returns the version of the Plugin.

The `metadataProvider` function returns information about the type of metadata provider and its location. For more information on metadata provider, refer to https://github.com/safe-global/safe-core-protocol-specs/.

The `requireRootAccess` function indicates if a Plugin requires root access to an Account. It will return `true` if the root access is required and `false` otherwise.

## Implementation of a Plugin

The [BaseTestPlugin](https://github.com/5afe/safe-core-protocol/blob/main/contracts/test/TestPlugin.sol) is an abstract contract that can be used as a starting point when building a Plugin, as if offers a very simple implementation of the `ISafeProtocolPlugin` interface:

```typescript
abstract contract BaseTestPlugin is ISafeProtocolPlugin {
    string public name = "";
    string public version = "";
    bool public requiresRootAccess = false;

    function metadataProvider() external view override returns (uint256 providerType, bytes memory location) {}

    function setRequiresRootAccess(bool _requiresRootAccess) external {
        requiresRootAccess = _requiresRootAccess;
    }

    function supportsInterface(bytes4 interfaceId) external view override returns (bool) {
        return interfaceId == type(ISafeProtocolPlugin).interfaceId || interfaceId == 0x01ffc9a7;
    }
}
```

Depending on if a Plugin needs root access or not, the Manager should be called via the `executeRootAccess` or `executeTransaction` functions respectively.

### TestPlugin without root access

When no access root is required, a Plugin needs to call the Manager via the `executeTransaction` method, passing the Account address and the transaction that is going to be triggered from the Plugin.

```typescript
contract TestPlugin is BaseTestPlugin {
    function executeFromPlugin(
        ISafeProtocolManager manager,
        ISafe safe,
        SafeTransaction calldata safetx
    ) external returns (bytes[] memory data) {
        (data) = manager.executeTransaction(safe, safetx);
    }
}
```

Where `SafeTransaction` is a struct that contains the following data:

```typescript
struct SafeProtocolAction {
    address payable to;
    uint256 value;
    bytes data;
}

struct SafeTransaction {
    SafeProtocolAction[] actions;
    uint256 nonce;
    bytes32 metadataHash;
}
```

### TestPlugin with root access

When access root is required, the Plugin needs to call the Manager via the `executeRootAccess` method, passing the Account address and the transaction that is going to be triggered from the Plugin.

```typescript
contract TestPluginWithRootAccess is BaseTestPlugin {
    constructor() {
        requiresRootAccess = true;
    }

    function executeFromPlugin(
        ISafeProtocolManager manager,
        ISafe safe,
        SafeRootAccess calldata safeRootAccesstx
    ) external returns (bytes memory data) {
        (data) = manager.executeRootAccess(safe, safeRootAccesstx);
    }
}
```

Where `SafeRootAccess` is a struct that contains the following data:

```typescript
struct SafeRootAccess {
    SafeProtocolAction action;
    uint256 nonce;
    bytes32 metadataHash;
}
```

## Management of Plugins

Check the [Manager](../manager.md) to see how to manage Plugins.

## Plugin examples

An example of a Plugin is the [RelayPlugin](https://github.com/5afe/safe-core-protocol-demo/blob/main/contracts/contracts/Plugins.sol) from the [Safe{Core} Protocol Demo App](https://github.com/5afe/safe-core-protocol-demo). When the `executeFromPlugin` function of this plugin is called, it will send a transaction to the [Gelato Relay](https://docs.gelato.network/developer-services/relay) and call the Account to extract the networks fees from the Account's balance and transfer them to the relay fee collector.
