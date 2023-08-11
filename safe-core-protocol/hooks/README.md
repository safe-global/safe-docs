# Hooks

Hooks add additional logic at certain points of the transaction lifecycle. Hooks enable various forms of security protections such as allow- and deny-lists, MEV-protections, risk-assessments, and more. The Safe{Core} Protocol currently recognizes the following types of hooks:

- `preCheck`/`preCheckRootAccess`: verifies custom conditions using the state before a transaction is executed.
- `postCheck`: verifies custom conditions at the end of a transaction and reverts.

Hooks can check any interaction done with an [Account](../accounts.md) via the [Manager](../manager.md) and also check direct interactions on the Account (i.e. via the `execTransaction` flow).

{% hint style="danger" %}
The Safe{Core} Protocol is still in alpha version and it should only be used in test networks until there is a production release.
{% endhint %}

Hooks must implement the following interface:

```typescript
interface ISafeProtocolHooks is IERC165 {
    function preCheck(
        ISafe safe,
        SafeTransaction calldata tx,
        uint256 executionType,
        bytes calldata executionMeta
    ) external returns (bytes memory preCheckData);

    function preCheckRootAccess(
        ISafe safe,
        SafeRootAccess calldata rootAccess,
        uint256 executionType,
        bytes calldata executionMeta
    ) external returns (bytes memory preCheckData);

    function postCheck(ISafe safe, bool success, bytes calldata preCheckData) external;
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

The `preCheck` function is called by an Account before the execution of a transaction if the hook is enabled. It should contain custom logic that validates the pre-state and contents of the transaction for non-root access.

The `preCheckRootAccess` function is called by an Account before the execution of a transaction if the hook is enabled and the transaction requires root access. It should contain custom logic that validates the pre-state and contents of the transaction for root access.

The `postCheck` function is called by an Account after the execution of a transaction if the hook is enabled. This function should contain custom logic that validates the post-state after the transaction is executed and revert if it is not as expected.

There are two execution types:

- `Multisignature flow`: the hook checks a transaction triggered directly from an Account.
- `Plugin flow`: the hook checks a transaction triggered by a Plugin.

## Management of Hooks

Check the [Manager](../manager.md) to see how to manage Hooks.
