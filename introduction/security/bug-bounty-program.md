# Bug Bounty

This is the page of the Safe bug bounty program. Find bugs and get rewarded. Earn up to $1,000,000 for every bug you report. Please carefully read through the [submission process](https://docs.gnosis-safe.io/introduction/security/bug-bounty-program#submission-process) section and get in touch via [bounty@safe.global](mailto:bounty@safe.global).

### Audits

The contracts have been carefully audited by smart contract security experts. For details, please refer to the [security audits page](https://docs.gnosis.io/safe/docs/intro\_audits).

### Rules

Many of the [Ethereum Foundation’s bug bounty program rules](https://bounty.ethereum.org) are also applicable for the Safe bug bounty program:

* Issues that have already been submitted by another user or are already known to the Gnosis team are not eligible for bounty rewards.
* Public disclosure of a vulnerability makes it ineligible for a bounty.
* The Gnosis core development team, employees, and all other people paid by Gnosis, directly or indirectly (including the external auditors), are not eligible for rewards.
* The Safe bounty program considers a number of variables in determining rewards. Determinations of eligibility, score, and all terms related to an award are at the sole and final discretion of the Safe bug bounty panel.

### Scope

The scope of the bug bounty program includes the core contracts related to the following releases of the Safe contracts:

* _v1.1.1_ ([Release details](https://github.com/gnosis/safe-contracts/releases/tag/v1.1.1), [readme](https://github.com/gnosis/safe-contracts/blob/v1.1.1/README.md))
* _v1.2.0_ ([Release details](https://github.com/gnosis/safe-contracts/releases/tag/v1.2.0), [readme](https://github.com/gnosis/safe-contracts/blob/v1.2.0/README.md))
* _v1.3.0_ ([Release details](https://github.com/gnosis/safe-contracts/releases/tag/v1.3.0), [readme](https://github.com/gnosis/safe-contracts/blob/v1.3.0/README.md))

The scope of the bug bounty also includes the [allowance module](https://github.com/gnosis/safe-modules/blob/47e2b486b0b31d97bab7648a3f76de9038c6e67b/allowances).

#### In scope

**Gnosis Safe core contracts**

* GnosisSafe.sol
* GnosisSafeL2.sol
* GnosisSafeProxyFactory.sol (formerly ProxyFactory.sol)
* GnosisSafeProxy.sol (formerly Proxy.sol)
* CreateAndAddModules.sol, MultiSend.sol, MultiSendCallOnly.sol, CreateCall.sol
* DefaultCallbackHandler.sol, CompatibilityFallbackHandler.sol, HandlerContext.sol

Addresses for deployed instances of these contracts can be found in the [Safe deployments](https://github.com/gnosis/safe-deployments) repository.

**Safe modules contracts**

* AllowanceModule.sol

#### Examples of what’s in scope

* Being able to steal funds
* Being able to freeze funds or render them inaccessible by their owners
* Being able to perform replay attacks on the same chain
* Being able to change Safe settings or module settings without consent of owners

#### Out of scope

* Any files, modules or libraries other than the ones mentioned above
* More efficient gas solutions
* Any points listed as an already known weaknesses
* Any points listed in the audit or formal verification results reports
* Any points fixed in a newer version

### Intended behavior

Please refer to the [readme file](https://github.com/gnosis/safe-contracts/blob/v1.3.0/README.md) and the [release details](https://github.com/gnosis/safe-contracts/releases) of the respective contract version on Github as well as our [developer docs](https://docs.gnosis.io/safe/docs/contracts\_intro) for an extensive overview of the intended behavior of the smart contracts.

For the allowance module, please refer to the corresponding [readme file](https://github.com/gnosis/safe-modules/blob/47e2b486b0b31d97bab7648a3f76de9038c6e67b/allowances/README.md)

### Compensation

Any bugs — they do not need to necessarily lead to a redeploy — will be considered for a bounty, but the severity of the threat will change the reward. Below are the reward levels for each threat severity along with an example of such a threat.

#### High threat: up to $1,000,000

An identified attack that could steal funds or tokens or lock user funds would be considered a high threat. Likewise, a reported bug that, on its own, leads to a redeploy of the code will always be considered a high threat.

#### Medium threat: up to $50,000

An identified attack where it is possible to steal funds because of unexpected behavior on the part of the user. Unexpected behavior here means that it is not possible for the user to anticipate and comprehend that the funds will be lost.

#### Low threat: up to $10,000

A way to avoid transaction fees or an exploit that in some way compromises the experience of other Safe users.

_All bounties will be paid in ETH._

Please note that the submission’s quality will factor into the level of compensation. A high-quality submission includes an explanation of how the bug can be reproduced, a failing test case, a valid scenario in which the bug can be exploited, and a fix that makes the test case pass. High-quality submissions may be awarded amounts higher than the amounts specified above.

### Submission Process

Please email your submissions to: [bounty@gnosis.io](mailto:bounty@gnosis.io).

Don’t forget to include your ETH address, so that you may be rewarded. If more than one address is specified, only one will be used at the discretion of the bounty program administrators. Anonymous submissions are welcome, too.

Please consult our [privacy policy](https://gnosis.io/privacy-policy) for further details on how we handle submissions.

### Responsible Disclosure Policy

If you comply with the policies below when reporting a security issue to us, we will not initiate a lawsuit or law enforcement investigation against you in response to your report.

_We ask that:_

* You give us reasonable time to investigate and mitigate an issue you report before making public any information about the report or sharing such information with others.
* You make a good faith effort to avoid privacy violations and disruptions to others, including (but not limited to) destruction of data and interruption or degradation of our services.
* You do not exploit a security issue you discover for any reason. This includes demonstrating additional risk, such as an attempted compromise of sensitive company data or probing for additional issues.
* You do not violate any other applicable laws or regulations.

Public disclosure of the bug or the indication of an intention to exploit it on Mainnet will make the report ineligible for a bounty. If in doubt about other aspects of the bounty, most of the [Ethereum Foundation bug bounty program rules](https://bounty.ethereum.org) will apply here.

Any questions? Reach us via email ([bounty@gnosis.io](mailto:bounty@gnosis.io)) or [Discord](https://chat.gnosis-safe.io). For more information on the Safe, check out our [website](https://gnosis-safe.io) and our [Github](https://github.com/gnosis?q=safe).

_Happy hunting!_

### Past paid bounties

_This list includes valid submissions from past and current contract versions for which a bounty has been paid._

#### Potential suicide of MultiSend library

We use a [MultiSend](https://github.com/gnosis/safe-contracts/blob/v1.2.0/contracts/libraries/MultiSend.sol) library to batch multiple transactions together. A transaction could be created that would self-destruct the contract. While this would not have put any funds at risk, user experience would have been seriously impacted.

We have updated the library as well as our interfaces. Details about the fix can be found on [Github](https://github.com/gnosis/safe-contracts/pull/156).

This bug was submitted by [Micah Zoltu](https://twitter.com/micahzoltu). It was regarded as "Low Threat", and a bounty of 1,000 USD has been paid out.

#### Transaction failure when receiving funds via `transfer` or `send`

Since the beginning of the bug bounty period, the contract update has been live on the Ethereum Mainnet. We performed extensive internal testing and also discovered an edge case where a Safe could not receive funds from another contract via `send` or `transfer`. This was due to additional gas costs caused by the [emission of additional events](https://github.com/gnosis/safe-contracts/pull/135) and [gas price changes](https://eips.ethereum.org/EIPS/eip-1884) in the latest hardfork. This issue has been fixed and more details can be found on [Github](https://github.com/gnosis/safe-contracts/issues/149).

#### Duplicate owners during setup could render Safe unusable

There is a bug in the `setupOwners` function on `OwnerManager.sol` which allows duplicate owners to be set when the duplicated address is next to itself in the `_owners` array. This could cause unexpected behavior. While it is not possible to steal funds of existing Safes it is indeed an unexpected behaviour and user funds might be locked. During Safe creation the threshold of a Safe could be set to something unreachable, thereby making it impossible to execute a transaction afterwards.

The Safe interfaces all prevent this from happening by checking for duplicates, but if users directly interact with the contracts this can still happen. The issue is tracked on [Github](https://github.com/gnosis/safe-contracts/issues/244).

This bug was submitted by [David Nicholas](https://twitter.com/davidnich11). It was regarded as "Medium Threat" and a bounty of 2,500 USD has been paid out.

#### Setting a Safe as an owner of itself essentially reduces threshold by 1

The contracts allow to set a Safe as an owner of itself. This has the same effect as lowering the threshold by 1, as it is possible for anyone to generate a valid signature for the Safe itself when triggering `execTransaction`. This is especially an issue for Safes with a threshold of 1. If a Safe with threshold 1 adds itself as an owner, anyone can execute transactions.

To our knowledge there is no real use case where it would make sense to set a Safe as an owner of itself. Hence only a few number of Safes used themselves as owners. Most of these Safes could be contacted and the Safe have been removed as an owner. The Safes still affected are Safes used for testing by us or Safes owned by a single owner with a threshold > 1 (so no immediate risk).

To fix this, the next contract update will prevent the Safe as its owner via `require(owner != address(this), "Safe can't be an owner")`. This check can be performed when adding owners and/or when checking signatures.

Details about this issue can be found on [Github](https://github.com/gnosis/safe-contracts/issues/229).

The bug was submitted by [Kevin Foesenek](https://github.com/keviinfoes). It was regarded as "Medium Threat" and a bounty of 5,000 USD has been paid out.
