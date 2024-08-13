// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  vite: {
    plugins: [nodePolyfills()]
  },
  runtimeConfig: {
    public: {
      NUXT_PUBLIC_PIMLICO_API_KEY: process.env.NUXT_PUBLIC_PIMLICO_API_KEY
    }
  }
})
