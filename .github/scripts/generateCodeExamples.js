const fs = require('fs')

const repos = [
  {
    organization: '5afe',
    repo: 'safe-passkeys-tutorial',
    destination: './pages/home/passkeys-tutorials/examples',
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
    const url = `https://raw.githubusercontent.com/${organization}/${repo}/${branch}${filePath}`
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
