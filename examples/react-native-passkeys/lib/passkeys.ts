import { Platform } from "react-native";
import RNBase64 from "react-native-base64";
import { create, get } from "react-native-passkeys";

const RP_NAME = "Safe Smart Account";
const USER_DISPLAY_NAME = "Safe account";
const USER_NAME = "safe-account";
const DOMAIN = "add_your_domain_here";
const CHALLENGE = "the-challenge";
const USER_ID = "my-user-id";

// This function verifies the passkey of the user.
export async function getPassKey(
  options?: CredentialRequestOptions
): Promise<Credential | null> {
  // Convert the challenge to a base64 URL string.
  const challenge = bufferSourceToBase64Url(options?.publicKey?.challenge);
  // Convert the allowCredentials to a binary string.
  const allowCredentials = options?.publicKey?.allowCredentials?.map(
    (cred) => ({
      type: cred.type,
      id: getBinaryString(cred.id),
    })
  );

  // Get the passkey of the user.
  let credential = await get({
    rpId: DOMAIN,
    challenge,
    userVerification: options?.publicKey?.userVerification,
    allowCredentials,
  });

  // Convert the passkey to a Credential object.
  if (credential?.response) {
    credential.response.authenticatorData = base64ToArrayBuffer(
      credential.response.authenticatorData
    );
    credential.response.clientDataJSON = base64ToArrayBuffer(
      credential.response.clientDataJSON
    );
    credential.response.signature = base64ToArrayBuffer(
      credential.response.signature
    );
  }

  // Return the passkey credential.
  return credential as Credential;
}

// This function creates a new passkey for the user.
export async function createPassKey() {
  // Convert the challenge to a base64 URL string.
  const challenge =
    Platform.OS === "web"
      ? crypto.getRandomValues(new Uint8Array(32))
      : bufferToBase64URLString(utf8StringToBuffer(CHALLENGE));

  // Generate a random user ID.
  const userId =
    Platform.OS === "web"
      ? crypto.getRandomValues(new Uint8Array(32))
      : bufferToBase64URLString(utf8StringToBuffer(USER_ID));

  // Create the passkey request JSON.
  const credentialRequestJson = {
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    challenge,
    rp: {
      id: Platform.OS === "web" ? window.location.hostname : DOMAIN,
      name: RP_NAME,
    },
    user: { displayName: USER_DISPLAY_NAME, id: userId, name: USER_NAME },
    timeout: 60_000,
    attestation: "none",
  };

  // Add the authenticator selection to the request JSON
  if (Platform.OS !== "web") {
    //@ts-expect-error authenticatorSelection is not in the official types
    credentialRequestJson.authenticatorSelection = {
      requireResidentKey: true,
    };
  }

  // Create the passkey for the user using official passkeys API.
  const passkey =
    Platform.OS === "web"
      ? await navigator.credentials.create({
          publicKey:
            credentialRequestJson as unknown as PublicKeyCredentialCreationOptions,
        })
      : await create(credentialRequestJson as Parameters<typeof create>[0]);

  return passkey;
}

/*
* Helper functions:
*/
function bufferToBase64URLString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String = btoa(str);

  return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function utf8StringToBuffer(value: string): ArrayBuffer {
  return new TextEncoder().encode(value);
}

function getBinaryString(buffer: any) {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((byte) => String.fromCharCode(byte))
    .join("");
}

function bufferSourceToBase64Url(bufferSource: any) {
  const binaryString = getBinaryString(bufferSource);
  const base64String = RNBase64.encode(binaryString);
  return base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64ToArrayBuffer(base64: string) {
  base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
//
