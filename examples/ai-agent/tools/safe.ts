import { z } from "zod";
import Safe from "@safe-global/protocol-kit";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

export const getEthBalance = async ({ address, chainId }) => {
  if (chainId !== "1") throw new Error("Chain ID not supported.");
  if (!address.startsWith("0x") || address.length !== 42) {
    throw new Error("Invalid address.");
  }

  const fetchedEthBalance = await fetch(
    `https://safe-transaction-mainnet.safe.global/api/v1/safes/${address}/balances/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((error) => {
    throw new Error("Error fetching data from the tx service:" + error);
  });

  const ethBalanceData = await fetchedEthBalance.json();
  const weiBalance = ethBalanceData.find(
    (element) => element?.tokenAddress === null && element?.token === null
  )?.balance;
  const ethBalance = BigInt(weiBalance) / BigInt(10 ** 18); // Convert from wei to eth

  return `The current balance of the Safe Multisig at address ${address} is ${ethBalance.toLocaleString(
    "en-US"
  )} ETH.`;
};

export const deployNewSafe = async () => {
  const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString(); // Random 10-digit integer
  const protocolKit = await Safe.init({
    provider: "https://rpc.ankr.com/eth_sepolia",
    signer: process.env.AGENT_PRIVATE_KEY,
    predictedSafe: {
      safeAccountConfig: {
        owners: [process.env.AGENT_ADDRESS as string],
        threshold: 1,
      },
      safeDeploymentConfig: {
        saltNonce,
      },
    },
  });

  const safeAddress = await protocolKit.getAddress();

  const deploymentTransaction =
    await protocolKit.createSafeDeploymentTransaction();

  const safeClient = await protocolKit.getSafeProvider().getExternalSigner();

  const transactionHash = await safeClient?.sendTransaction({
    to: deploymentTransaction.to,
    value: BigInt(deploymentTransaction.value),
    data: deploymentTransaction.data as `0x${string}`,
    chain: sepolia,
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  await publicClient?.waitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  });

  return `A new Safe multisig was successfully deployed on Sepolia. You can see it live at https://app.safe.global/home?safe=sep:${safeAddress}. The saltNonce used was ${saltNonce}.`;
};

export const getEthBalanceMetadata = {
  name: "getEthBalance",
  description:
    "Call to get the balance in ETH of a Safe Multisig for a given address and chain ID.",
  schema: z.object({
    address: z.string(),
    chainId: z.enum(["1"]),
  }),
};

export const deployNewSafeMetadata = {
  name: "deployNewSafe",
  description: "Call to deploy a new 1-1 Safe Multisig on Sepolia.",
  schema: z.object({}),
};
