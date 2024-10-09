<template>
  <div class="p-6">
    <header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <UIcon name="SafeIcon" class="dark:white black h-9 w-24" />
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
              <UIcon
                name="tabler:external-link"
                class="dark:white black h-6 w-6"
              />
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
              <UIcon name="uil:github" class="dark:white black h-6 w-6" />
            </template>
          </UButton>
        </div>
      </div>
    </header>
    <main class="flex justify-center">
      <slot />
    </main>
  </div>
</template>
