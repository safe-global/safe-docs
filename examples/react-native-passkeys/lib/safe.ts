import Safe, {
  EthSafeMessage,
  PasskeyArgType,
  SigningMethod,
} from "@safe-global/protocol-kit";
import { waitForTransactionReceipt } from "viem/actions";
import {
  WalletClient,
  Transport,
  Chain,
  Hex,
  Account,
  WaitForTransactionReceiptReturnType,
} from "viem";

export async function activateAccount(
  protocolKit: Safe
): Promise<WaitForTransactionReceiptReturnType<Chain>> {
  const safeDeploymentTransaction =
    await protocolKit.createSafeDeploymentTransaction();

  const signer = (await protocolKit
    .getSafeProvider()
    .getExternalSigner()) as WalletClient<Transport, Chain, Account>;
  const client = protocolKit.getSafeProvider().getExternalProvider();

  if (!signer)
    throw new Error(
      "SafeProvider must be initialized with a signer to use this function"
    );

  const hash = await signer.sendTransaction({
    to: safeDeploymentTransaction.to as `0x${string}`,
    data: safeDeploymentTransaction.data as Hex,
    value: BigInt(safeDeploymentTransaction.value),
    account: signer.account,
  });

  const receipt = await waitForTransactionReceipt(client, { hash });

  return receipt;
}

export async function addPasskeyOwner(
  protocolKit: Safe,
  signer: PasskeyArgType
): Promise<WaitForTransactionReceiptReturnType<Chain>> {
  const addOwnerTx = await protocolKit.createAddOwnerTx({
    passkey: signer,
  });
  const client = protocolKit.getSafeProvider().getExternalProvider();
  const signedAddOwnerTx = await protocolKit.signTransaction(
    addOwnerTx,
    SigningMethod.ETH_SIGN
  );

  const txResult = await protocolKit.executeTransaction(signedAddOwnerTx);

  const receipt = await waitForTransactionReceipt(client, {
    hash: txResult.hash as `0x${string}`,
  });

  return receipt;
}

export async function signPasskeyMessage(
  protocolKit: Safe,
  message: string
): Promise<EthSafeMessage> {
  const safeMessage = protocolKit.createMessage(message);

  const signedMessage = await protocolKit.signMessage(
    safeMessage,
    SigningMethod.ETH_SIGN
  );

  return signedMessage;
}

export async function sendDummyPasskeyTransaction(
  protocolKit: Safe,
  protocolKitSigner: Safe,
  to: string
): Promise<WaitForTransactionReceiptReturnType<Chain>> {
  const transaction = {
    to,
    value: "0",
    data: "0x",
  };
  const client = protocolKit.getSafeProvider().getExternalProvider();

  const safeTransaction = await protocolKitSigner.createTransaction({
    transactions: [transaction],
  });

  const signedTransaction = await protocolKitSigner.signTransaction(
    safeTransaction
  );

  const txResult = await protocolKit.executeTransaction(signedTransaction);
  const receipt = await waitForTransactionReceipt(client, {
    hash: txResult.hash as `0x${string}`,
  });

  return receipt;
}
