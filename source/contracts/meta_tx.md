# Meta transactions relays and the Safe

## Front Running Submitted Transactions
As all the parameters required for execution are part of the submitted transaction it is possible that miners front-run the original relayer to receive the reward. In the long run that behaviour would be appreciated, since it would allow that anybody submits these transactions with `gasPrice` of the transaction triggering `execTransaction` set to 0. Miners could pick up these transactions and claim the rewards.