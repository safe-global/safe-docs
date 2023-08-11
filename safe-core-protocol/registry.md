# Registry

The Registry serves a critical function in the Safe{Core} Protocol by keeping track of all Modules and ensuring they comply with the prescribed rules.

To fulfil this role, the Registry must define the rules that Modules should adhere to. Various mechanisms, such as audits and bug bounties, can be employed to verify and enforce these rules. The [Manager](./manager.md) interacts with the Registry to confirm that only approved Modules are allowed.

The Registry must implement the following interface:

```typescript
interface ISafeProtocolRegistry is IERC165 {
    function check(address integration) external view returns (uint64 listedAt, uint64 flaggedAt);
}
```

The [`check`](https://github.com/5afe/safe-core-protocol/blob/0dc36e02a1b39865a7f09ddc63e236494bff9a58/contracts/interfaces/Registry.sol#L9) function returns information about a Module, whether it is listed on the Registry or flagged. The returned values are the block numbers when the Module was listed or flagged, or 0 in case the Module was not listed or flagged.

## The Safe Protocol Registry

The [SafeProtocolRegistry](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolRegistry.sol) is a registry that allows the owner of the contract to register and flag Modules.

Modules can be of different [types](https://github.com/5afe/safe-core-protocol/blob/main/contracts/common/Enum.sol):
- [Plugins](./plugins/README.md)
- [Hooks](./hooks/README.md)
- Function handlers

The owner of the Registry contract can list them by calling the [`addIntegration`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolRegistry.sol#L47) function, passing the address of the Module and its corresponding type. Modules can only be added once.

```typescript
function addIntegration(address integration, Enum.IntegrationType integrationType) external virtual onlyOwner
```

The owner of the Registry contract can also flag the Modules by calling the [`flagIntegration`](https://github.com/5afe/safe-core-protocol/blob/main/contracts/SafeProtocolRegistry.sol#L80) function. Only previously added Modules can be flagged and each Module can only be flagged once. If a Module is flagged it will become unusable. Registry owners could do that in case a bug in the Module is found.

```typescript
function flagIntegration(address integration) external onlyOwner
```

## The Test Safe Protocol Registry Unrestricted

The [TestSafeProtocolRegistryUnrestricted](https://github.com/5afe/safe-core-protocol/blob/main/contracts/test/TestSafeProtocolRegistryUnrestricted.sol) is a version of the `SafeProtocolRegistry` that does not restrict any account from listing a new Module. This contract is only for testing purposes and not meant to be used in production.
