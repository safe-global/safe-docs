# Deployment
The Gnosis Safe smart contract was written with the usage of a proxy contract in mind. Because of that there is no constructor and it is required to call an initilize function on the contract before it can be used. For this it is recommended to use the ProxyFactory or the DelegatingConstructorProxy.

## Initialization
After the Safe proxy is deployed it needs to be initialized. As the general proxy has no constructor it is necessary to initialize the contract using a function call.

For this the **GnosisSafe.sol** contract exposes the method `setup`. It requires four parameters:

1. owners - List of Safe owners.
1. threshold - Number of required confirmations for a Safe transaction.
1. to - Contract address for optional delegate call.
1. data - Data payload for optional delegate call.

Using `to` and `data` it is possible to nest advanced initialization. One of the use cases would be to initialize a Safe with some default modules. This can be done using the **CreateAndAddModules.sol** library.

The module assumes that Proxies are used for all modules. The library will use a **ProxyFactory** to deploy a Proxy for each module. So when triggering the `setup` method `to` would be the address of the deployed libary contract and `data` the call to the method `createAndAddModules`. This method has two parameters:

1. proxyFactory - Address of the Proxy factory used to create the Proxy for each module
1. data - Modules initialization payload. This is the data for each proxy factory call concatinated.

For a complete example see the [CreateAndAddModules test](https://github.com/gnosis/safe-contracts/blob/v0.0.2-alpha/test/createAndAddModules.js)

## Trustless deployment with ERC20 Tokens
Using the ProxyFactory or deploying a proxy requires that the user has Ether on an externally owned account. To make it possible to pay for the creation with any token or Ether the following flow is used.

1. Create deployment transaction. The [PayingProxy](https://github.com/gnosis/safe-contracts/blob/v0.0.2-alpha/contracts/proxies/PayingProxy.sol) enables the payment in any ERC20 token. Once the proxy is deployed it will refund a predefined address with the funds present at the address where it was deployed.
1. To make the deployed address deterministic it is necessary to use a known account and calculate the target address. To make this trustless it is recommended to use a random account that has nonce 0. This can be done by creating a random signature for the deployment transaction. From that transaction it is possible to derive the sender and the target address.
1. The user needs to transfer at least the amount required for the payment to the target address.
1. Once the payment is present at the target address the relay service will fund the sender with Ether required for the creation transaction.
1. As soon as the sender is funded the creation transaction can be submitted.

For more details on the Safe deployment process please checkout the [DappCon 2018 presentation](https://youtu.be/RGBKAfyvAHk?t=416)

## Planned usage of Create2
The described approach for trustless deployment requires 3 transactions:

1. Fund calculated Safe address
1. Fund address that will deploy the Proxy contract
1. Deploy the Proxy contract

Using the new `create2` opcode makes it possible to use a factory without having to worry about the nonce of the factory. By using a factory it is possible to eliminate one of the transactions required by described flow. The adjusted flow would be the following:

1. Fund calculated Safe address (address is based on **factory address**, the **init code** of the contract that is deployed and a **salt**)
1. Trigger the Proxy factory

To make sure that the correct contract will be deployed the Safe configuration should be part of the **init code** and the **salt** should be generated in a way that all parties involved can verify that it was not manipulated.
