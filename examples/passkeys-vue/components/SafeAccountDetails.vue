<script setup lang="ts">
import { useSafeStore } from '@/stores/safe'

const store = useSafeStore()

async function handleMintNFT() {
  store.setIsLoading(true)

  const userOp = await mintNFT(store.selectedPasskey, store.safeAddress!)

  store.setIsLoading(false)
  store.setIsSafeDeployed(true)
  store.setUserOp(userOp)
  store.setJiffyLink(
    `https://jiffyscan.xyz/userOpHash/${userOp}?network=${CHAIN_NAME}`
  )
  store.setSafeLink(
    `https://app.safe.global/home?safe=sep:${store.safeAddress}`
  )
}

const DEFAULT_CHAR_DISPLAYED = 6

function splitAddress(
  address: string,
  charDisplayed: number = DEFAULT_CHAR_DISPLAYED
): string {
  const firstPart = address.slice(0, charDisplayed)
  const lastPart = address.slice(address.length - charDisplayed)

  return `${firstPart}...${lastPart}`
}
</script>

<template>
  <div
    v-if="Object.keys(store.selectedPasskey).length !== 0"
    class="mt-20 dark:bg-stone-800 bg-stone-50 p-8 rounded w-fit flex flex-col items-center"
  >
    <h1 class="text-4xl text-[#12FF80]">Your Safe Accout</h1>
    <UIcon
      v-if="store.isLoading"
      name="line-md:loading-loop"
      class="mt-4 w-12 h-12"
    />
    <div v-if="!store.isLoading" class="flex flex-col items-center">
      <UButton
        variant="link"
        color="white"
        v-if="store.safeAddress"
        class="my-8"
        :to="store.safeLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <template #leading
          ><UIcon name="token:safe" class="h-8 w-8" /> </template
        >{{ splitAddress(store.safeAddress) }}
        <template #trailing
          ><UIcon name="tabler:external-link" class="w-5 h-5" />
        </template>
      </UButton>
      <UBadge
        v-if="store.safeAddress && !store.isSafeDeployed"
        color="yellow"
        variant="solid"
        >Deployment pending
      </UBadge>
      <UButton
        variant="outline"
        v-if="store.safeAddress"
        icon="material-symbols:image-outline"
        class="mt-8 ml-2 mr-2"
        @click="handleMintNFT"
      >
        Mint NFT</UButton
      >
      <UButton
        variant="link"
        color="white"
        v-if="store.userOp"
        class="my-8"
        :to="store.jiffyLink"
        target="_blank"
        rel="noopener noreferrer"
        >{{ store.userOp }}
        <template #trailing>
          <UIcon name="tabler:external-link" class="w-5 h-5" /> </template
      ></UButton>
    </div>
  </div>
</template>
