const fs = require('fs')
const path = require('path')

const rootDir = ['./pages', './components', './examples']
const allowedExtensions = ['.md', '.mdx']

// If links are not pointing to an external resource (http/https...) they MUST have a file extension to avoid problems in the future
const markdownLinkRegex = /\[.+?\]\(([^)]+)\)/g
const ignorePatterns = [
  /^\/$/,
  /^#/,
  /^http/,
  /^mailto:/,
  /\.png/,
  /\.json/,
  /\.md/,
  /\.mdx/,
  /\.gif/,
]

let hasIssues = false

function checkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      checkDir(fullPath)
    } else if (entry.isFile() && allowedExtensions.includes(path.extname(entry.name))) {
      checkFile(fullPath)
    }
  }
}

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8')
  const matches = [...content.matchAll(markdownLinkRegex)]
  matches.forEach(match => {
    const link = match[1]
    const isIgnored = ignorePatterns.some(pattern => pattern.test(link))
    if (!isIgnored) {
      console.log(`${filePath}: ${match[0]}`)
      hasIssues = true
    }
  })
}

rootDir.map(dir => checkDir(dir))

if (hasIssues) {
  process.exit(1)
} else {
  console.log('All links formatted correctly')
}
