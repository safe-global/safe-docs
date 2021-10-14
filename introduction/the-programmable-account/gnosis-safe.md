# Safe Benefits

The Safe is a smart contract wallet with multi-signature functionality at its core. It enables the following features:

#### High Security

Safe's **multi-signature** functionality allows you to define a list of owner accounts and a threshold number of accounts required to confirm a transaction. Once the threshold of owner accounts have confirmed a transaction, the Safe transaction can be executed. Owners can either be EOAs or other smart contract accounts.

#### Advanced execution logic

It is possible to make use of different** Safe Library contracts** to perform complex transactions. A very common example of this is **batched transactions** where multiple simple Ethereum transactions are combined and executed at once. That means instead of having to sign several transactions sequentially, a user just needs to sign one batched transaction.

#### Advanced access management

You can add** Safe Modules** to your Safe. Thereby it is possible to implement more fine-grained access management. For instance, it is possible to define a module that can only be used to **recover access** to a Safe under specific circumstances. A popular version of this is the **Social Recovery Module**. A different example is **allowance modules** that allow owners of a Safe to grant limited execution permission, such as a daily limit to external accounts.

#### Token callback support

Many new tokens require wallet contracts to implement callbacks. Token standards like **ERC721** and **ERC1155** allow contracts to immediately react to receiving tokens through these and make it even possible to reject the transfer completely.

#### Ether-less accounts

Another core functionality of the Safe is **token payment**. Generally, Ethereum transactions require ETH for paying transaction fees (“gas”). With the Safe, users can pay transaction fees in a number of supported ERC20 tokens. This is realized via a transaction relay service that accepts those tokens and submits the transactions to the blockchain, therefore paying the gas fee in ETH. With the same functionality, Ether-less transactions can be implemented, where a 3rd party pays transaction fees on behalf of a Gnosis Safe via the same relay service.
