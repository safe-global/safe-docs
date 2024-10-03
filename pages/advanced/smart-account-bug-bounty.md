# Bug Bounty

Participate in the Safe Bug Bounty program to find bugs and get rewards. Earn up to $1,000,000 for every bug you report. Please carefully read through the [submission process](#submission-process) section and get in touch via [bounty@safe.global](mailto:bounty@safe.global). You can also review the [bug bounties](./smart-account-bug-bounty/past-paid-bounties.md) we have paid in the past.

## Audits

Smart contract security experts have carefully audited Safe's contracts. Please refer to the [security audits page](./smart-account-audits.md) for details.

## Rules

Many of the [Ethereum Foundation's bug bounty program rules](https://bounty.ethereum.org) are also applicable to the Safe Bug Bounty program:

* Issues already submitted by another user or known to the Safe team aren't eligible for bounty rewards.
* Public disclosure of a vulnerability makes it ineligible for a bounty.
* The Safe core development team, employees, and all other people paid by Safe, directly or indirectly (including the external auditors), aren't eligible for rewards.
* The Safe Bounty program considers several variables in determining rewards. Determinations of eligibility, score, and all terms related to an award are at the sole and final discretion of the Safe Bug Bounty panel.

## Scope

The scope of the bug bounty program includes the core contracts related to the following releases of the Safe contracts:

* v1.4.1 ([Release details](https://github.com/safe-global/safe-smart-account/releases/tag/v1.4.1), [README](https://github.com/safe-global/safe-smart-account/blob/v1.4.1/README.md))
* _v1.3.0_ ([Release details](https://github.com/safe-global/safe-smart-account/releases/tag/v1.3.0), [README](https://github.com/safe-global/safe-smart-account/blob/v1.3.0/README.md))
* _v1.2.0_ ([Release details](https://github.com/safe-global/safe-smart-account/releases/tag/v1.2.0), [README](https://github.com/safe-global/safe-smart-account/blob/v1.2.0/README.md))
* _v1.1.1_ ([Release details](https://github.com/safe-global/safe-smart-account/releases/tag/v1.1.1), [README](https://github.com/safe-global/safe-smart-account/blob/v1.1.1/README.md))

The scope of the bug bounty also includes officially supported Safe Modules:
* _v0.1.0_ [Allowance Module](https://github.com/safe-global/safe-modules/tree/47e2b486b0b31d97bab7648a3f76de9038c6e67b/allowances)
* _v0.1.1_ [Allowance Module](https://github.com/safe-global/safe-modules/tree/allowance/v0.1.1/modules/allowances)
* _v0.3.0_ [Safe 4337 Module](https://github.com/safe-global/safe-modules/tree/4337/v0.3.0/modules/4337)
* _v0.2.1_ [Safe Passkey](https://github.com/safe-global/safe-modules/tree/passkey/v0.2.1/modules/passkey)

### In scope

**Safe core contracts (version 1.4.1)**

* Safe.sol (formerly GnosisSafe.sol)
* SafeL2.sol (formerly GnosisSafeL2.sol)
* SafeProxyFactory.sol (formerly GnosisSafeProxyFactory.sol)
* SafeProxy.sol (formerly GnosisSafeProxy.sol)
* MultiSend.sol, MultiSendCallOnly.sol, CreateCall.sol
* TokenCallbackHandler.sol (formerly DefaultCallbackHandler.sol), CompatibilityFallbackHandler.sol, HandlerContext.sol

You can find addresses for deployed instances of these contracts [here](/home/supported-networks?version=v1.4.1) or in the [Safe deployments](https://github.com/safe-global/safe-deployments) repository.

**Gnosis Safe core contracts (up to version 1.3.0)**

* GnosisSafe.sol
* GnosisSafeL2.sol
* GnosisSafeProxyFactory.sol (formerly ProxyFactory.sol)
* GnosisSafeProxy.sol (formerly Proxy.sol)
* CreateAndAddModules.sol, MultiSend.sol, MultiSendCallOnly.sol, CreateCall.sol
* DefaultCallbackHandler.sol, CompatibilityFallbackHandler.sol, HandlerContext.sol

You can find addresses for deployed instances of these contracts [here](/home/supported-networks?version=v1.3.0) in the [Safe deployments](https://github.com/safe-global/safe-deployments) repository.

**Safe Modules contracts**

* AllowanceModule.sol
* Safe4337Module.sol
* SafeWebAuthnSignerFactory.sol, SafeWebAuthnSignerProxy.sol, SafeWebAuthnSignerSingleton.sol, SafeWebAuthnSharedSigner.sol, WebAuthn.sol, P256.sol

### Examples of what's in scope

* Being able to steal funds
* Being able to freeze funds or render them inaccessible by their owners
* Being able to perform replay attacks on the same chain
* Being able to change Safe settings or module settings without the consent of owners

### Out of scope

* Any files, Safe Modules, or libraries other than the ones mentioned above
* More efficient gas solutions
* Any points listed as an already known weaknesses
* Any points listed in the audit or formal verification results reports
* Any points fixed in a newer version

## Intended behavior

Please refer to the [README file](https://github.com/safe-global/safe-smart-account/blob/v1.4.1/README.md) and the [release details](https://github.com/safe-global/safe-smart-account/releases) of the respective contract version on GitHub as well as our [developer docs](https://docs.safe.global) for an extensive overview of the intended behavior of the smart contracts.

For the modules, please refer to their corresponding READMEs:
* [Allowance Module](https://github.com/safe-global/safe-modules/tree/allowance/v0.1.1/modules/allowances/README.md).
* [Safe 4337 Module](https://github.com/safe-global/safe-modules/tree/4337/v0.3.0/modules/4337/README.md).
* [Safe Passkey](https://github.com/safe-global/safe-modules/tree/passkey/v0.2.1/modules/passkey/README.md).

## Compensation

All bugs (they don't necessarily need to lead to a redeploy) will be considered for a bounty, but the severity of the threat will change the reward. Below are the reward levels for each threat severity and an example of such a threat.

### High threat: Up to $1,000,000

An identified attack that could steal funds or tokens or lock user funds would be considered a high threat. Likewise, a reported bug that, on its own, leads to a redeploy of the code will always be regarded as a high threat.

### Medium threat: Up to $50,000

An identified attack where it's possible to steal funds because of unexpected behavior on the user's part. Unexpected behavior here means the user can't anticipate and comprehend that they will lose the funds.

### Low threat: Up to $10,000

A way to avoid transaction fees or an exploit that in some way compromises the experience of other Safe users.

_Safe will pay all bounties in ETH._

Please note that the submission's quality will factor into the level of compensation. A high-quality submission should include an explanation of how somebody can reproduce the bug.


## Submission Process

Please email your submissions to [bounty@safe.global](mailto:bounty@safe.global).

Remember to include your ETH address so that you may be rewarded. If more than one address is specified, Safe will use only one at the discretion of the bounty program administrators. Anonymous submissions are welcome, too.

Please consult our [privacy policy](https://safe.global/privacy) for further details on how we handle submissions.

## Responsible Disclosure Policy

If you comply with the policies below when reporting a security issue to us, we won't initiate a lawsuit or law enforcement investigation against you in response to your report.

_We ask that:_

* You give us reasonable time to investigate and mitigate an issue you report before making public any information about the report or sharing such information with others.
* You make a good faith effort to avoid privacy violations and disruptions to others, including (but not limited to) data destruction and interruption or degradation of our services.
* You don't exploit a security issue you discover for any reason. This includes demonstrating additional risk, such as an attempted compromise of sensitive company data or probing for additional issues.
* You don't violate any other applicable laws or regulations.

Public disclosure of the bug or the indication of an intention to exploit it on Mainnet will make the report ineligible for a bounty. If in doubt about other aspects of the bounty, most of the [Ethereum Foundation bug bounty program rules](https://bounty.ethereum.org) will apply here.

Any questions? Reach us via email ([bounty@safe.global](mailto:bounty@safe.global)) or [Discord](https://chat.safe.global). For more information on the Safe, check out our [website](https://safe.global) and our [GitHub](https://github.com/safe-global).

_Happy hunting!_

## Note on Safe{Wallet}

Generally, bugs and issues regarding Safe{Wallet} frontend or backend are _out of scope_. This refers to the [web app](https://app.safe.global), mobile apps, as well as the wallet backend services. For general bug reports, please consider submitting an issue on the respective repository such as [safe-wallet-web](https://github.com/safe-global/safe-wallet-web/issues). 

Please send _severe security-related_ issues concerning Safe{Wallet} to [wallet-reports@safe.global](mailto:wallet-reports@safe.global). We will carefully check all submissions; however, rewards remain voluntarily at our sole discretion.
