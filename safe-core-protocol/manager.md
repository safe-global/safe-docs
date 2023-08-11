# Manager

At the heart of the protocol is the Manager, ensuring adherence to the prescribed conduct and procedures set by the [Registry](./registry.md). The Manager serves as an intermediary layer coordinating communication and interactions between [Accounts](./accounts.md) and Modules.

The Manager must implement the following interface:

```typescript
interface ISafeProtocolManager {
    function executeTransaction(
        ISafe safe,
        SafeTransaction calldata transaction
    ) external returns (bytes[] memory data);

    function executeRootAccess(
        ISafe safe,
        SafeRootAccess calldata rootAccess
    ) external returns (bytes memory data);
}
```

Where `SafeTransaction` and `SafeRootAccess` are structs that contain the following data:

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

struct SafeRootAccess {
    SafeProtocolAction action;
    uint256 nonce;
    bytes32 metadataHash;
}
```

## The Safe Protocol Manager

The [SafeProtocolManager](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolManager.sol) contract allows Accounts to set [Plugins](./plugins/README.md) from a Registry through a Manager rather than doing it directly on the Account. Users have to first enable `SafeProtocolManager` as a Plugin on the Account and then enable other Plugins through the mediator.

The [`executeTransaction`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolManager.sol#L76) function in the `SafeProtocolManager` executes non-delegate call(s) on an Account if the Plugin is enabled on the Account. If any one of the actions fail, the transaction reverts.
The value of the `to` transaction property in the actions should be restricted so that a Module cannot execute an action that changes the config such as enabling/disabling other Modules or make changes to its own access level for an Account.

To handle the return data (as it is an array of actions):
- The size of `data` must be equal to the size of the actions array.
- Each element in `data` corresponds to the action that has been executed i.e. `data[i]` is the result of `action[i]`.
- If the execution of action(s) fail, the transaction must revert.

The [`executeRootAccess`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolManager.sol#L129) function executes a delegate call on a Safe if the Plugin is enabled and root access it granted. It will return the data bytes containing the result of the executed action.

### Enable the Manager as a Plugin in an Account

The [`enableModule`](https://github.com/safe-global/safe-contracts/blob/main/contracts/base/ModuleManager.sol#L48) function in the Safe contracts allows to enable the `SafeProtocolManager` as a Plugin by passing its address as the only parameter. This call needs to be a Safe transaction because it has the `authorized` modifier.

```typescript
function enableModule(address module) public authorized
```

### Management of Plugins

An Account can call the Manager to enable on that Account a Plugin that is listed in the associated Registry as long as it is not flagged. These management tasks can be executed by calling the following functions:

The [`enablePlugin`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolManager.sol#L173) function in the `SafeProtocolManager` allows to enable a Plugin from the Registry on an Account and needs to be called from the same Account.

```typescript
function enablePlugin(
    address plugin,
    bool allowRootAccess
) external noZeroOrSentinelPlugin(plugin) onlyPermittedPlugin(plugin)
```

The [`disablePlugin`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolManager.sol#L202) function allows to disable a Plugin on an Account and needs to be called from the same Account.

```typescript
function disablePlugin(
    address prevPlugin,
    address plugin
) external noZeroOrSentinelPlugin(plugin)
```

The [`getPluginsPaginated`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolManager.sol#L243) function returns all the enabled Plugins for a given Account.

```typescript
function getPluginsPaginated(
    address start,
    uint256 pageSize,
    address safe
) external view returns (address[] memory array, address next)
```

The [`getPluginInfo`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolManager.sol#L222) function returns information about an Account and a Plugin.

```typescript
function getPluginInfo(address safe, address plugin) external view returns (PluginAccessInfo memory enabled) function returns if a Plugin is enabled for a given Account.
```

The [`isPluginEnabled`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolManager.sol#L230) function allows to check if a Plugin is enabled for a given Account.

```typescript
function isPluginEnabled(address safe, address plugin) public view returns (bool)
```

### Management of Hooks

An Account can call the Manager to set a new Hook or read if there is already an enabled Hook. This is achieved by calling the following methods:

The [`getEnabledHooks`](https://github.com/5afe/safe-core-protocol/blob/0dc36e02a1b39865a7f09ddc63e236494bff9a58/contracts/base/HooksManager.sol#L20) function in the `HooksManager` returns the address of the enabled hooks for a given Account that is provided as a function parameter. In case there are no Hooks enabled the return value will be the zero address.

```typescript
function getEnabledHooks(address safe) external view returns (address hooksAddress)
```

The [`setHooks`](https://github.com/5afe/safe-core-protocol/blob/0dc36e02a1b39865a7f09ddc63e236494bff9a58/contracts/base/HooksManager.sol#L28) function in the `HooksManager` sets a Hook on an Account where the Account is the `msg.sender`. If the zero address is set, the Manager will not perform the pre and post checks for any Account transaction.

```typescript
function setHooks(address hooks) external
```
