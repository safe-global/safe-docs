const fs = require('fs')

const repos = [
  {
    organization: '5afe',
    repo: 'safe-passkeys-tutorial',
    destination: './examples/passkeys',
    branch: 'main',
    files: [
      '/lib/constants.ts',
      '/lib/utils.ts',
      '/lib/passkeys.ts',
      '/lib/usdc.ts',
      '/components/PasskeyList.tsx',
      '/app/page.tsx',
      '/app/layout.tsx'
    ]
  },
  {
    organization: '5afe',
    repo: 'safe-7579-tutorial',
    destination: './examples/erc-7579',
    branch: 'main',
    files: [
      '/lib/permissionless.ts',
      '/lib/scheduledTransfers.ts',
      '/components/ScheduledTransferForm.tsx',
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
      .catch((res) => {
        console.error('Error fetching file for', filePath, ':', res.statusText)
      })
  })
}

repos.forEach(generateCodeExamples)
