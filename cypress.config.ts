import { defineConfig } from 'cypress'

export default defineConfig({
  userAgent: 'cypress',
  retries: {
    runMode: 0,
    openMode: 0
  },
  screenshotOnRunFailure: process.env.CI === 'true',
  video: process.env.CI === 'true',
  includeShadowDom: true,
  chromeWebSecurity: process.env.CHROME_WEB_SECURITY !== 'false',
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    coverage: false
  },
  e2e: {
    testIsolation: false,
    baseUrl: process.env.NEXT_PUBLIC_HOST_URL,
    specPattern: 'tests/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: false
  }
})
