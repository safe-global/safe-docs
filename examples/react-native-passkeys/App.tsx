import { useEffect, useState } from "react";
import prompt from "react-native-prompt-android";
import Safe, { PasskeyArgType } from "@safe-global/protocol-kit";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {
  getStoredPassKey,
  removeStoredPassKey,
  storePassKey,
} from "./lib/storage";
import { createPassKey, getPassKey } from "./lib/passkeys";
import {
  activateAccount,
  addPasskeyOwner,
  sendDummyPasskeyTransaction,
  signPasskeyMessage,
} from "./lib/safe";

const PASSKEY_NAME = "safe-owner";

export default function App() {
  const [protocolKit, setProtocolKit] = useState<Safe | null>(null);
  const [passkeySignerProtocolKit, setPasskeySignerProtocolKit] =
    useState<Safe | null>(null);
  const [passkeySigner, setPasskeySigner] = useState<PasskeyArgType | null>(
    null
  );
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let protocolKitInstance = await Safe.init({
        provider: process.env.EXPO_PUBLIC_RPC_URL as string,
        signer: process.env.EXPO_PUBLIC_SAFE_SIGNER_PK,
        predictedSafe: {
          safeAccountConfig: {
            owners: JSON.parse(process.env.EXPO_PUBLIC_SAFE_OWNERS as string),
            threshold: 1,
          },
          safeDeploymentConfig: {
            saltNonce: process.env.EXPO_PUBLIC_SAFE_SALT_NONCE,
          },
        },
      });

      const safeAddress = await protocolKitInstance.getAddress();
      const isDeployed = await protocolKitInstance.isSafeDeployed();

      console.log("Safe address", safeAddress);
      console.log("Is deployed", isDeployed);

      setSafeAddress(safeAddress);
      setIsDeployed(isDeployed);

      if (isDeployed) {
        protocolKitInstance = await protocolKitInstance.connect({
          provider: process.env.EXPO_PUBLIC_RPC_URL,
          signer: process.env.EXPO_PUBLIC_SAFE_SIGNER_PK,
          safeAddress: safeAddress,
        });
      }

      setProtocolKit(protocolKitInstance);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const storedPasskey = await getStoredPassKey(PASSKEY_NAME);

      setPasskeySigner(storedPasskey);
    })();
  }, []);

  useEffect(() => {
    if (!passkeySigner || !safeAddress) return;

    (async () => {
      const passkeySignerProtocolKitInstance = await Safe.init({
        provider: process.env.EXPO_PUBLIC_RPC_URL,
        signer: { ...passkeySigner, getFn: getPassKey } as PasskeyArgType,
        safeAddress,
      });

      setPasskeySignerProtocolKit(passkeySignerProtocolKitInstance);
    })();
  }, [safeAddress, passkeySigner]);

  const handleActivateAccount = async () => {
    if (!protocolKit || !safeAddress) return;

    setIsLoading(true);

    const receipt = await activateAccount(protocolKit);

    if (receipt.transactionHash) {
      setIsDeployed(true);

      const updatedProtocolKitInstance = await protocolKit.connect({
        provider: protocolKit.getSafeProvider().provider,
        signer: protocolKit.getSafeProvider().signer,
        safeAddress: await protocolKit.getAddress(),
      });

      setProtocolKit(updatedProtocolKitInstance);

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleAddPasskeyOwner = async () => {
    if (!protocolKit) {
      return;
    }

    const passkeyCredential = await createPassKey();

    if (!passkeyCredential) {
      throw Error("Passkey creation failed: No credential was returned.");
    }

    const signer = await Safe.createPasskeySigner(passkeyCredential);

    setIsLoading(true);

    await addPasskeyOwner(protocolKit, signer);

    await storePassKey(signer, PASSKEY_NAME);

    const passkeySignerProtocolKitInstance = await Safe.init({
      provider: process.env.EXPO_PUBLIC_RPC_URL,
      signer: { ...signer, getFn: getPassKey } as PasskeyArgType,
      safeAddress: safeAddress as string,
    });

    setPasskeySignerProtocolKit(passkeySignerProtocolKitInstance);
    setPasskeySigner(signer);
    setIsLoading(false);
  };

  const handleSignMessage = async () => {
    if (!passkeySignerProtocolKit) return;

    prompt(
      "Sign message",
      "Enter the message to sign",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Sign",
          onPress: async (message: string) => {
            const signedMessage = await signPasskeyMessage(
              passkeySignerProtocolKit,
              message
            );

            if (Platform.OS === "web") {
              window.alert(
                (signedMessage.data as string) +
                  "\n" +
                  signedMessage.encodedSignatures()
              );
            } else {
              Alert.alert(
                signedMessage.data as string,
                signedMessage.encodedSignatures()
              );
            }
          },
        },
      ],
      {
        type: "plain-text",
        cancelable: false,
        defaultValue: "",
        placeholder: "placeholder",
        style: "shimo",
      }
    );
  };

  const handleSendTransaction = async () => {
    if (!safeAddress || !protocolKit || !passkeySignerProtocolKit) return;

    setIsLoading(true);

    const receipt = await sendDummyPasskeyTransaction(
      protocolKit,
      passkeySignerProtocolKit,
      safeAddress
    );

    setIsLoading(false);

    if (receipt.transactionHash) {
      if (Platform.OS === "web") {
        window.alert(receipt.transactionHash);
      } else {
        Alert.alert("Transaction hash", receipt.transactionHash);
      }
    }
  };

  const handleRemovePasskey = async () => {
    removeStoredPassKey(PASSKEY_NAME);
    setPasskeySigner(null);
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.loadingContainer} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Safe Passkeys Demo</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Safe Address</Text>
        <Text style={styles.text}>{safeAddress}</Text>
      </View>

      {!isDeployed && (
        <View style={styles.sectionContainer}>
          <Text style={styles.text}>⚠️ The account is not activated yet</Text>
          <View style={styles.button}>
            <Button
              color="#12FF80"
              title="Activate Account"
              onPress={handleActivateAccount}
            />
          </View>
        </View>
      )}

      {isDeployed && (
        <>
          {!passkeySigner && (
            <View style={styles.button}>
              <Button
                color="#12FF80"
                title="Add Passkey Owner"
                onPress={handleAddPasskeyOwner}
              />
            </View>
          )}

          {passkeySigner && (
            <>
              <View style={styles.button}>
                <Button
                  color="#12FF80"
                  title="Sign Message"
                  onPress={handleSignMessage}
                />
              </View>
              <View style={styles.button}>
                <Button
                  color="#12FF80"
                  title="Send Dummy Transaction"
                  onPress={handleSendTransaction}
                />
              </View>
              <View style={styles.button}>
                <Button
                  color="#12FF80"
                  title="Remove Passkey"
                  onPress={handleRemovePasskey}
                />
              </View>
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    color: "#fff",
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
    color: "#12FF80",
  },
  sectionContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#fff",
  },
  text: {
    fontSize: 16,
    textAlign: "left",
    marginBottom: 8,
    color: "#fff",
  },
  button: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
