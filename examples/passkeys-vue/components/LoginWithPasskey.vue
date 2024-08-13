<script setup lang="ts">
import { useSafeStore } from "@/stores/safe";
import { Safe4337Pack } from "@safe-global/relay-kit";

import type { PasskeyArgType } from "@safe-global/protocol-kit";

const store = useSafeStore();
const runtimeConfig = useRuntimeConfig();

async function handleCreatePasskey() {
  const passkey = await createPasskey();

  storePasskeyInLocalStorage(passkey);
  store.setSelectedPasskey(passkey);

  await showSafeInfo(passkey);
}

async function selectExistingPasskey() {
  const passkeys = loadPasskeysFromLocalStorage();

  store.setPasskeys(passkeys);
  store.setSelectedPasskey(passkeys[0]);

  await showSafeInfo(store.selectedPasskey);
}

async function showSafeInfo(passkey: PasskeyArgType) {
  store.setIsLoading(true);
  const safe4337Pack = await Safe4337Pack.init({
    provider: RPC_URL,
    signer: passkey,
    bundlerUrl: BUNDLER_URL + runtimeConfig.public.NUXT_PUBLIC_PIMLICO_API_KEY,
    options: {
      owners: [],
      threshold: 1,
    },
  });
  store.setSafeAddress(await safe4337Pack.protocolKit.getAddress());
  store.setIsSafeDeployed(await safe4337Pack.protocolKit.isSafeDeployed());
  store.setIsLoading(false);
}
</script>

<template>
  <div
    v-if="Object.keys(store.selectedPasskey).length === 0"
    class="mt-20 bg-stone-800 p-8 rounded w-fit flex flex-col items-center"
  >
    <h1 class="text-4xl text-[#12FF80]">Use Safe Account via Passkeys</h1>
    <h2 class="my-12">Create a new Safe using Passkeys</h2>
    <UButton
      icon="material-symbols:fingerprint"
      block
      class="mb-8"
      variant="outline"
      @click="handleCreatePasskey"
    >
      Create a new passkey
    </UButton>
    <UDivider label="OR" :ui="{ border: { base: 'dark:border-gray-500' } }" />
    <h2 class="my-12">Connect existing Safe using an existing passkey</h2>
    <UButton icon="material-symbols:fingerprint" block @click="selectExistingPasskey"
      >Use an existing passkey</UButton
    >
  </div>
</template>
