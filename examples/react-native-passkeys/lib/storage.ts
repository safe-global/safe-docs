import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PasskeyArgType } from "@safe-global/protocol-kit";

const isWeb = Platform.OS === "web";

// This function stores the passkey in the local storage of the device. 
export async function storePassKey(passkey: PasskeyArgType, label: string) {
  const serializedPasskey = JSON.stringify(passkey);

  if (isWeb) {
    localStorage.setItem(label, serializedPasskey);
  } else {
    await AsyncStorage.setItem(label, serializedPasskey);
  }
}

// This function retrieves the passkey from the local storage of the device.
export async function getStoredPassKey(label: string) {
  if (isWeb) {
    const passkey = localStorage.getItem(label);
    return passkey ? JSON.parse(passkey) : undefined;
  } else {
    const passkey = await AsyncStorage.getItem(label);

    return passkey ? JSON.parse(passkey) : undefined;
  }
}

// This function removes the passkey from the local storage of the device.
export async function removeStoredPassKey(label: string) {
  if (isWeb) {
    localStorage.removeItem(label);
  } else {
    await AsyncStorage.removeItem(label);
  }
}
