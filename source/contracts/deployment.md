# Deployment
The Gnosis Safe Personal Edition smart contract was written with the usage of a proxy contract in mind. Because of that there is no constructor and it is required to call an inilize function on the contract before it can be used. For this it is recommended to use the ProxyFactory or the DelegatingConstructorProxy.

## Trustless deployment with ERC20 Tokens
Using the ProxyFactory or deploying a proxy requires that the user has ether on an externally owned account. To make it possible to pay for the creation with any token or ether the following flow is used.

1. Create deployment transaction. The PayingProxy enables the payment in any ERC20 token. Once the proxy is deployed it will refund a predefined address with the funds present at the address where it was deployed.
1. To make the deployed address deterministic it is necessary to use a known account and calculate the target address. To make this trustless it is recommended to use a random account that has nonce 0. This can be done by creating a random signature for the deployment transaction. From that transaction it is possible to derive the sender and the target address.
1. The user needs to transfer at least the amount required for the payment to the target address.
1. Once the payment is present at the target address the relay service will fund the sender with ether required for the creation transaction.
1. As soon as the sender is funded the creation transaction can be submitted.

For more details on the Safe deployment process please checkout the [DappCon 2018 presentation](https://youtu.be/RGBKAfyvAHk?t=416)