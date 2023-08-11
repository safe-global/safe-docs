# Account

The Safe{Core} Protocol is designed to be account agnostic. This initial alpha version sets a focus on the 1.x versions of Safe Smart Accounts to expedite the development process and gather feedback. These learnings are the foundation upon which the protocol is opened up to other account implementations.

Accounts must implement the following interface:

```typescript
interface ISafe {
    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes memory data,
        uint8 operation
    ) external returns (bool success, bytes memory returnData);
}
```

The `execTransactionFromModuleReturnData` function allows an external contract to execute a transaction in the Account by passing the `to`, `value`, `data` and `operation`. As a result of the execution of the transaction, it will return a boolean variable called `success` that will have the values `true` or `false` depending if the transaction was executed successfully, and the corresponding data.

The external contract calling this function is the [Manager](./manager.md), that will first check if the [Plugin](./plugins/README.md) triggering the transaction initially is included in the associated [Registry](./registry.md) and also if it is enabled for this Account. Only if those conditions are met this function will be called and the transaction will be executed.
