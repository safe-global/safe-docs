const shell = require('shelljs')
const fs = require('fs')
const path = require('path')

// Explore a given directory recursively and return all the file paths
const walkPath = (dir: string) => {
  let results: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach(function (file: string) {
    const filePath: string = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat?.isDirectory()) {
      results = results.concat(walkPath(filePath))
    } else {
      results.push(filePath)
    }
  })

  return results
}

const cloneRepo = (
  repoUrl: string,
  repoDestination: string,
  mdDestination: string
) => {
  const isModules = repoDestination === 'modules'
  const source = repoDestination + '/' + repoDestination
  shell.exec(`git clone ${repoUrl} ${repoDestination}`)
  const paths = walkPath(source)
    .map(p => p.replace(source, ''))
    .filter(p => !p.includes('test/'))

  if (!isModules) {
    shell.exec(`cd ${repoDestination} && git checkout release/v1.4.1`)
  }

  shell.exec(
    `cd ${repoDestination} && ${
      isModules ? 'p' : 'npm i && '
    }npm i @solarity/hardhat-markup`
  )

  const hardhatConfigPath = `${repoDestination}/hardhat.config.ts`
  const hardhatConfig = fs.readFileSync(hardhatConfigPath, 'utf8')
  const newHardhatConfig =
    'import "@solarity/hardhat-markup";\n' + hardhatConfig
  fs.writeFileSync(hardhatConfigPath, newHardhatConfig, 'utf8')

  shell.exec(`cd ${repoDestination} && npx hardhat markup`)
  shell.rm('-rf', mdDestination)
  shell.cp(
    '-R',
    `${repoDestination}/generated-markups/contracts`,
    mdDestination
  )
  shell.rm('-rf', 'contracts')
}

const main = () => {
  cloneRepo(
    `https://github.com/safe-global/safe-smart-account/`,
    'contracts',
    'pages/smart-contracts/smart-account-reference'
  )
  cloneRepo(
    `https://github.com/safe-global/safe-modules/`,
    'modules',
    'pages/smart-contracts/modules-reference'
  )
}

main()
