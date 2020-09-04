---
id: intro_bug_bounty
title: Bug bounty program
sidebar_label: Bug bounty program
---

This is the page of the Gnosis Safe bug bounty program. Find bugs and get rewarded. Earn up to $100,000 for every bug you report. 
Please carefully read though the [submission process](#submission-process) section and get in touch via [bounty@gnosis.io](mailto:bounty@gnosis.io).

## Audits

The contracts have been carefully audited by smart contract security experts. For details, please refer to the [security audits page](/safe/docs/intro_audits).

## Rules

Many of the [Ethereum Foundation’s bug bounty program rules](https://bounty.ethereum.org/) are also applicable for the Gnosis Safe bug bounty program:

- Issues that have already been submitted by another user or are already known to the Gnosis team are not eligible for bounty rewards.
- Public disclosure of a vulnerability makes it ineligible for a bounty.
- The Gnosis core development team, employees, and all other people paid by Gnosis, directly or indirectly (including the external auditors), are not eligible for rewards.
- The Gnosis Safe bounty program considers a number of variables in determining rewards. Determinations of eligibility, score, and all terms related to an award are at the sole and final discretion of the Gnosis Safe bug bounty panel.

## Scope

The scope of our bug bounty program includes core contracts related to release *v1.1.1* ([Release details](https://github.com/gnosis/safe-contracts/releases/tag/v1.1.1), [readme](https://github.com/gnosis/safe-contracts/blob/v1.1.1/README.md)) and *v1.2.0* ([Release details](https://github.com/gnosis/safe-contracts/releases/tag/v1.2.0), [readme](https://github.com/gnosis/safe-contracts/blob/v1.2.0/README.md)) of the Gnosis Safe contracts.

#### In scope:

- GnosisSafe.sol
- ProxyFactory.sol
- CreateAndAddModules.sol, MultiSend.sol, CreateCall.sol
- DefaultCallbackHandler.sol

#### Examples of what’s in scope:

- Being able to steal funds
- Being able to freeze funds or render them inaccessible by their owners
- Being able to perform replay attacks on the same chain
- Being able to change Safe settings without owner consent

#### Out of scope:

- Any files, modules or libraries other than the ones mentioned above
- More efficient gas solutions
- Any points listed as an already known weaknesses
- Any points listed in the audit or formal verification results reports

## Intended behavior

Please refer to the [readme file](https://github.com/gnosis/safe-contracts/blob/development/README.md) and the [release details](https://github.com/gnosis/safe-contracts/releases) of the respective contract version on Github as well as our [developer docs](/safe/docs/contracts_intro) for an extensive overview of the intended behavior of the smart contracts.

## Compensation

Any bugs — they do not need to necessarily lead to a redeploy — will be considered for a bounty, but the severity of the threat will change the reward. Below are the reward levels for each threat severity along with an example of such a threat.

#### High threat: up to $100,000

An identified attack that could steal funds or tokens or lock user funds would be considered a high threat. Likewise, a reported bug that, on its own, leads to a redeploy of the code will always be considered a high threat.

#### Medium threat: up to $10,000

An identified attack where it is possible to steal funds because of unexpected behavior on the part of the user. Unexpected behavior here means that it is not possible for the user to anticipate and comprehend that the funds will be lost.

#### Low threat: up to $2,000

A way to avoid transaction fees or an exploit that in some way compromises the experience of other Gnosis Safe users.

*All bounties will be paid in ETH.*

Please note that the submission’s quality will factor into the level of compensation. A high-quality submission includes an explanation of how the bug can be reproduced, a failing test case, a valid scenario in which the bug can be exploited, and a fix that makes the test case pass. High-quality submissions may be awarded amounts higher than the amounts specified above.

## Submission Process

Please email your submissions to: [bounty@gnosis.io](mailto:bounty@gnosis.io).

Don’t forget to include your ETH address, so that you may be rewarded. If more than one address is specified, only one will be used at the discretion of the bounty program administrators. Anonymous submissions are welcome, too.

Please consult our [privacy policy](https://gnosis.io/privacy-policy) for further details on how we handle submissions.

## Responsible Disclosure Policy

If you comply with the policies below when reporting a security issue to us, we will not initiate a lawsuit or law enforcement investigation against you in response to your report.

*We ask that:*

- You give us reasonable time to investigate and mitigate an issue you report before making public any information about the report or sharing such information with others.
- You make a good faith effort to avoid privacy violations and disruptions to others, including (but not limited to) destruction of data and interruption or degradation of our services.
- You do not exploit a security issue you discover for any reason. This includes demonstrating additional risk, such as an attempted compromise of sensitive company data or probing for additional issues.
- You do not violate any other applicable laws or regulations.

Public disclosure of the bug or the indication of an intention to exploit it on Mainnet will make the report ineligible for a bounty. If in doubt about other aspects of the bounty, most of the [Ethereum Foundation bug bounty program rules](https://bounty.ethereum.org/) will apply here.

Any questions? Reach us via email ([bounty@gnosis.io](mailto:bounty@gnosis.io)) or [Discord](https://discordapp.com/invite/FPMRAwK). For more information on the Gnosis Safe, check out our [website](https://gnosis-safe.io) and our [Github](https://github.com/gnosis?q=safe).

## Honey Pot

We have previously transferred a significant amount of funds to a [Gnosis Safe](https://etherscan.io/address/0xafc2f2d803479a2af3a72022d54cc0901a0ec0d6) (15,000 ETH), which serves as a honey pot for bounty hunters. This honey pot will be updated to the latest version of the smart contracts in the upcoming weeks. The honey pot Gnosis Safe update will happen before we make the update available to our users.

At Gnosis, we are gradually moving substantial amounts of our company funds into a Gnosis Safe.

*Happy hunting!*

## Past paid bounties

*This list includes valid submissions from past and current contract versions for which a bounty has been paid.*

#### Potential suicide of MultiSend library

We use a [MultiSend](https://github.com/gnosis/safe-contracts/blob/development/contracts/libraries/MultiSend.sol) library to batch multiple transactions together. A transaction could be created that would self-destruct the contract. While this would not have put any funds at risk, user experience would have been seriously impacted.

We have updated the library as well as our interfaces. Details about the fix can be found on [Github](https://github.com/gnosis/safe-contracts/pull/156).

This bug was submitted by [Micah Zoltu](https://twitter.com/micahzoltu). It was regarded as "Low Threat", and a bounty of 1,000 USD has been paid out.

#### Transaction failure when receiving funds via `transfer` or `send`

Since the beginning of the bug bounty period, the contract update has been live on the Ethereum Mainnet. We performed extensive internal testing and also discovered an edge case where a Safe could not receive funds from another contract via `send` or `transfer`. This was due to additional gas costs caused by the [emission of additional events](https://github.com/gnosis/safe-contracts/pull/135) and [gas price changes](https://eips.ethereum.org/EIPS/eip-1884) in the latest hardfork. This issue has been fixed and more details can be found on [Github](https://github.com/gnosis/safe-contracts/issues/149).