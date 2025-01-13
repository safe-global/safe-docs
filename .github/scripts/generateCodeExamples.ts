const fs = require('fs')

type Repo = {
  organization: string
  repo: string
  destination: string
  branch: string
  files: string[]
}

const repos = [
  {
    organization: '5afe',
    repo: 'safe-passkeys-tutorial',
    destination: './examples/passkeys',
    branch: 'main',
    files: [
      '/lib/constants.ts',
      '/lib/passkeys.ts',
      '/lib/mintNFT.ts',
      '/components/LoginWithPasskey.tsx',
      '/components/SafeAccountDetails.tsx',
      '/components/SafeThemeProvider.tsx',
      '/app/page.tsx',
      '/app/layout.tsx',
      '/app/globals.css',
      '/next.config.mjs'
    ]
  },
  {
    organization: '5afe',
    repo: 'safe-passkeys-nuxt',
    destination: './examples/passkeys-vue',
    branch: 'main',
    files: [
      '/utils/constants.ts',
      '/utils/passkeys.ts',
      '/utils/mintNFT.ts',
      '/components/LoginWithPasskey.vue',
      '/components/SafeAccountDetails.vue',
      '/stores/safe.ts',
      '/app.vue',
      '/layouts/default.vue',
      '/nuxt.config.ts'
    ]
  },
  {
    organization: '5afe',
    repo: 'react-native-passkeys-tutorial',
    destination: './examples/react-native-passkeys',
    branch: 'main',
    files: [
      '/lib/passkeys.ts',
      '/lib/safe.ts',
      '/lib/storage.ts',
      '/App.tsx',
      '/.env-sample'
    ]
  }
  // {
  //   organization: '5afe',
  //   repo: 'safe-7579-tutorial',
  //   destination: './examples/erc-7579',
  //   branch: 'main',
  //   files: [
  //     '/lib/permissionless.ts',
  //     '/lib/scheduledTransfers.ts',
  //     '/components/ScheduledTransferForm.tsx',
  //     '/app/page.tsx',
  //     '/app/layout.tsx',
  //     '/app/globals.css',
  //     '/next.config.mjs'
  //   ]
  // }
]

const generateCodeExamples = async ({
  organization,
  repo,
  branch,
  destination,
  files
}: Repo) => {
  const fetch = await import('node-fetch')
  files.forEach(async filePath => {
    const url = `https://raw.githubusercontent.com/${organization}/${repo}/${branch}${filePath}?token=$(date +%s)`
    await fetch
      .default(url)
      .then(async res => {
        if (!res.ok) throw new Error(res.statusText)
        const text = await res.text()
        const destinationDirectory =
          destination + filePath.substring(0, filePath.lastIndexOf('/'))
        if (!fs.existsSync(destinationDirectory)) {
          fs.mkdirSync(destinationDirectory, { recursive: true })
        }
        fs.writeFileSync(destination + filePath, text)
      })
      .catch(res => {
        console.error('Error fetching file for', filePath, ':', res.statusText)
      })
  })
}

repos.forEach(generateCodeExamples)
