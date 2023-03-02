# EOAs vs. Smart Contract Accounts

What is the difference between Externally Owned Accounts (EOAs) and Smart Contract Accounts?

<figure><img src="../../.gitbook/assets/Slide 16_9 - 5.png" alt=""><figcaption><p>EOAs are controlled by a single private key, while Safe Accounts are controlled by code.</p></figcaption></figure>

### EOAs

To date, most accounts created on Ethereum and other EVM networks fall under the category of externally owned accounts. EOAs for short are accounts that use traditional key pairs. That is, they consist of a single private key that can be used to make transactions and sign messages. If you gain access to that private key, you gain full control of the account. Most popular wallets such as Metamask or imToken are simple EOAs, and even hardware wallets such as Ledger Nano or Trezor are based on EOAs. This means that only your private key—a single point of failure—stands between you and your funds being lost.

### Smart Contract accounts

The other type of Ethereum accounts are smart contract accounts. Like EOAs, smart contract accounts each have a unique public Ethereum address, and it’s impossible to tell them apart from EOAs by looking at an Ethereum address. Smart contract accounts too can receive funds and make transactions like EOAs. Generally, the key difference is that no single private key is used to verify transactions. Instead, the logic behind how the account completes transactions is defined in the smart contract code. Smart contracts are programs that run on the Ethereum blockchain and execute when specific conditions are met. Their functionality within contract accounts means that such accounts, in contrast to EOAs, can, for example, implement access rights that specify by whom, how, and under which conditions transactions can be executed, as well as more complex logic.

### Multi-signature Wallets

Multi-signature wallets are contract accounts that require multiple parties to confirm a transaction before it can be executed. These parties, each represented by a unique Ethereum account address, are defined as multi-signature wallet owners in the smart contract. Only when a predefined number of these owners confirm a transaction, will the transaction be executed. Hence, the single point of failure associated with private key-controlled accounts is removed; losing or compromising a private key will no longer automatically result in a loss of all funds controlled by the account.

<figure><img src="../../.gitbook/assets/Slide 16_9 - 4.png" alt=""><figcaption><p>Traditional wallet scheme where a single private key controls account access compared to Safe account where multiple keys are required to execute transactions</p></figcaption></figure>

<figure><img src="../../.gitbook/assets/Slide 16_9 - 6.png" alt=""><figcaption><p>A comparison of different storage solutions</p></figcaption></figure>
