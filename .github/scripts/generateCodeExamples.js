const fs = require('fs')

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
      '/app/page.tsx',
      '/app/layout.tsx'
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
    repo: 'safe-7579-tutorial',
    destination: './examples/erc-7579',
    branch: 'main',
    files: [
      '/lib/permissionless.ts',
      '/lib/safe.ts',
      '/lib/socialRecovery.ts',
      '/lib/userOp.ts',
      '/lib/utils.ts',
      '/components/Guardian.tsx',
      '/components/SafeAccountDetails.tsx',
      '/components/SocialRecovery.tsx',
      '/app/page.tsx',
      '/app/layout.tsx'
    ]
  }
]

const generateCodeExamples = async ({
  organization,
  repo,
  branch,
  destination,
  files
}) => {
  fs.rmSync(destination, { recursive: true, force: true })
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
