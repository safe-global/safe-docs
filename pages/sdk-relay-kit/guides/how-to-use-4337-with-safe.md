### Counterfactual deployment tests

1. Counterfactual Deployment using `xDAI` held by the Safe Account in Gnosis chain .
2. Counterfactual Deployment using ERC20 (`USDC`) held by the Safe Account in Gnosis chain (see [Pimlico docs](https://docs.pimlico.io/paymaster/erc20-paymaster/faqs#step-3-generate-the-paymasteranddata-to-place-in-your-useroperation)).
3. Counterfactual Deployment using an sponsored transaction in Gnosis Chain.
4. Counterfactual Deployment using an sponsored transaction and a policy in Gnosis Chain.

## Counterfactual Deployment using `xDAI` (Held by the Safe Account)

```typescript
// 1) Initialize pack with the paymaster data
const safe4337Pack = await Safe4337Pack.init({
  ethersAdapter,
  rpcUrl: RPC_URL,
  bundlerUrl: BUNDLER_URL,
  options: {
    owners: [await signer.getAddress()],
    threshold: 1,
    saltNonce: "4337",
  },
});
```

### First batch (Safe deployment + 2 USDC transfers)

**Deployment of a 4337 Safe Account using the xDAI held by the Safe in Gnosis chain and executing a batch of 2 transactions (2 USDC transfers)**

script used: `usdc-transfer-4337-counterfactual.ts`

NOTE: To execute this script, I needed to send at least `0.1 xDAI` to the Safe's address.

Safe Deployed: [`0x5370Dc00f52ef83BB7F126Ad02C129dE48a21A26`](https://app.safe.global/transactions/history?safe=gno:0x5370Dc00f52ef83BB7F126Ad02C129dE48a21A26)

Transaction: [`0xf40225be749ac794f6ad283f533046be70a6615bad65c8c7216be47a0bde7d00`](https://gnosisscan.io/tx/0xf40225be749ac794f6ad283f533046be70a6615bad65c8c7216be47a0bde7d00)

JiffyScan: https://jiffyscan.xyz/userOpHash/0x046de6fe121ba0ba19cee927aede721c0a470ef60f34fa999a858f97c313769b?network=gnosis

### Second batch (2 USDC transfers with the already deployed Safe Account)

After that I executed again the script `usdc-transfer-4337-counterfactual.ts`

Transaction: [`0x27efa8209471170fbed3a5685b5b283d229c2b081e5b527efa6e2507edea19d3`](https://gnosisscan.io/tx/0x27efa8209471170fbed3a5685b5b283d229c2b081e5b527efa6e2507edea19d3)

JiffyScan: https://jiffyscan.xyz/userOpHash/0x8cb50c681643d1a00df0482d370c527416ed867b3b4e58c7933b2c7a088148d2?network=gnosis

## Counterfactual Deployment using ERC20 tokens (`USDC`) (Held by the Safe Account)

```typescript
// 1) Initialize pack with the paymaster data
const safe4337Pack = await Safe4337Pack.init({
  ethersAdapter,
  rpcUrl: RPC_URL,
  bundlerUrl: BUNDLER_URL,
  paymasterOptions: {
    paymasterTokenAddress: usdcTokenAddress,
    paymasterAddress,
    // amountToApprove?: bigint // optional value to set the paymaster approve amount on the deployment
  },
  options: {
    owners: [await signer.getAddress()],
    threshold: 1,
    saltNonce: "4337", // to update the address
  },
});
```

script used: `usdc-transfer-4337-erc20-counterfactual.ts`

### First batch (Safe deployment + 2 USDC transfers)

**Deployment of a 4337 Safe Account using the ERC20 (`USDC`) held by the Safe in Gnosis chain and executing a batch of 2 transactions (2 USDC transfers)**

Safe Deployed: [`0x4b2B32129992891d0d11dA4C2aC90ca462DbCe22`](https://app.safe.global/transactions/history?safe=gno:0x4b2B32129992891d0d11dA4C2aC90ca462DbCe22)

Transaction: [`0xb6223fbcbac6b1d66c90e5aebc00ab21c2952e2f7fc69fbd318cbdb181869150`](https://gnosisscan.io/tx/0xb6223fbcbac6b1d66c90e5aebc00ab21c2952e2f7fc69fbd318cbdb181869150)

JiffyScan: https://jiffyscan.xyz/userOpHash/0xdaf7c7b6895ad256bfe805e2f774666f22e48e781be0fa1ada8b47c7ae62cf42?network=gnosis

### Second batch (2 USDC transfers with the already deployed Safe Account)

After that I executed again the script `usdc-transfer-4337-erc20-counterfactual.ts`

Transaction: [`0x27efa8209471170fbed3a5685b5b283d229c2b081e5b527efa6e2507edea19d3`](https://gnosisscan.io/tx/0x27efa8209471170fbed3a5685b5b283d229c2b081e5b527efa6e2507edea19d3)

JiffyScan: https://jiffyscan.xyz/userOpHash/0x8cb50c681643d1a00df0482d370c527416ed867b3b4e58c7933b2c7a088148d2?network=gnosis

## Counterfactual Deployment using an sponsored transaction in Gnosis Chain.

```typescript
// 1) Initialize pack with the paymaster data
const safe4337Pack = await Safe4337Pack.init({
  ethersAdapter,
  rpcUrl: RPC_URL,
  bundlerUrl: BUNDLER_URL,
  paymasterOptions: {
    isSponsored: true,
    paymasterUrl: PAYMASTER_URL,
    paymasterAddress,
    sponsorshipPolicyId: POLICY_ID, // this is an optional parameter
  },
  options: {
    owners: [await signer.getAddress()],
    threshold: 1,
    saltNonce: "4337",
  },
});
```

script used: `usdc-transfer-4337-sponsored-counterfactual.ts`

### First batch (Safe deployment + 2 USDC transfers)

**Deployment of a 4337 Safe Account using my current balance in [the Pimlico payments Dashboard](https://dashboard.pimlico.io/payment) and executing a batch of 2 transactions (2 USDC transfers)**

Safe Deployed: [`0x57a824C1375078F6e1427B3CB1d30c8822167800`](https://app.safe.global/transactions/history?safe=gno:0x57a824C1375078F6e1427B3CB1d30c8822167800)

Transaction: [`0x75fe4ab7d65d35a277e9500e4f07e694a5566b12f236cd8d12e0c751e37ce8a5`](https://gnosisscan.io/tx/0x75fe4ab7d65d35a277e9500e4f07e694a5566b12f236cd8d12e0c751e37ce8a5)

JiffyScan: https://jiffyscan.xyz/userOpHash/0xa920a2bc8176b0af3cd76459f8bcf322996935e9180b72c3eea64176a68e1928?network=gnosis

My balance in Pimlico has decreased by an amount equivalent to the transaction cost on Gnosis chain:
<img width="449" alt="Captura de pantalla 2024-03-14 a las 17 15 03" src="https://github.com/safe-global/safe-core-sdk/assets/26763673/9b247021-b70f-4f41-b4d3-d89e9153982e">

### Second batch (2 USDC transfers with the already deployed Safe Account)

After that I executed again the script `usdc-transfer-4337-sponsored-counterfactual.ts`

Transaction: [`0x05b3298f7b1a983e9be8636dc0d7472a7a133317ff7850c170a9b869a9d02583`](https://gnosisscan.io/tx/0x05b3298f7b1a983e9be8636dc0d7472a7a133317ff7850c170a9b869a9d02583)

JiffyScan: https://jiffyscan.xyz/userOpHash/0x20270254c16238c458c079630da1694978cf280971f7ce666c0b2ea32c9514b2?network=gnosis

## Counterfactual Deployment using an sponsored transaction and a policy in Gnosis Chain.

Policy Id used: `sp_pink_marten_broadcloak`
Policy: Only one transaction per user.

First transaction: [`0x37980b61cfec64d5aa1182d8506463f77082192c2fa448756d74d9305140f19b`](https://gnosisscan.io/tx/0x37980b61cfec64d5aa1182d8506463f77082192c2fa448756d74d9305140f19b)

Second transaction: `sponsorshipPolicy perUserMaximumOpCount reached` error:

![Captura de pantalla 2024-03-15 a las 10 11 59](https://github.com/safe-global/safe-core-sdk/assets/26763673/cc006fb0-0cd7-4b54-9e79-5707f0910eab)

## How this PR fixes it

Added paymasterOptions:

- `isSponsored`: flag to use sponsored transactions with Pimlico. (see your current balance in [the Pimlico payments Dashboard](https://dashboard.pimlico.io/payment))
- `sponsorshipPolicyId`: optional parameter to specify your policy. You can create your policy in [the Pimlico dashboard](https://dashboard.pimlico.io/sponsorship-policies).
- `paymasterAddress`: paymaster address, see [Pimlico addresses docs](https://docs.pimlico.io/paymaster/erc20-paymaster/contract-addresses).
- `paymasterTokenAddress`: paymaster ERC20 token address.
- `amountToApprove`: optional parameter to set the paymaster approve amount

```typescript
export type paymasterOptions = {
  paymasterUrl?: string;
  isSponsored?: boolean;
  sponsorshipPolicyId?: string;
  paymasterAddress: string;
  paymasterTokenAddress?: string;
  amountToApprove?: bigint;
};
```

## How to Test

Added 6 scripts to tests all 4337 features in the playground folder:

- `usdc-transfer-4337.ts`
- `usdc-transfer-4337-erc20.ts`
- `usdc-transfer-4337-sponsored.ts`
- `usdc-transfer-4337-counterfactual.ts`
- `usdc-transfer-4337-erc20-counterfactual.ts`
- `usdc-transfer-4337-sponsored-counterfactual.ts`
