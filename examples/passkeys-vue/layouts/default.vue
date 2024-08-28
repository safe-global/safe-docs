<script setup lang="ts">
const links = [
  {
    label: "Docs",
    icon: "i-heroicons-book-open",
    to: "/getting-started",
  },
  {
    label: "Pro",
    icon: "i-heroicons-square-3-stack-3d",
    to: "/pro",
  },
  {
    label: "Releases",
    icon: "i-heroicons-rocket-launch",
    to: "/releases",
  },
];
</script>

<template>
  <div class="p-6">
    <header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img src="/safe.svg" class="w-24 h-9" />
        </div>
        <div class="flex items-center">
          <UButton
            label="Button"
            variant="link"
            color="white"
            to="https://docs.safe.global/home/passkeys-tutorials/safe-passkeys-nuxt"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read tutorial
            <template #trailing>
              <img src="/external-link.svg" class="w-5 h-5" />
            </template>
          </UButton>
          <UButton
            label="Button"
            variant="link"
            color="white"
            to="https://github.com/5afe/safe-passkeys-nuxt"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
            <template #trailing>
              <img src="/github.svg" class="w-7 h-7" />
            </template>
          </UButton>
        </div>
      </div>
    </header>
    <main class="flex justify-center text-white">
      <slot />
    </main>
  </div>
</template>
