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

const generateMarkdownFromNatspec = (
  repoDestination: string,
  mdDestination: string,
  moduleName?: string
) => {
  // Install the dependencies and add the @solarity/hardhat-markup plugin
  shell.exec(
    `cd ${repoDestination} && ${
      moduleName != null ? 'p' : 'npm i && '
    }npm i @solarity/hardhat-markup`
  )
  // Add the plugin to the hardhat.config.ts file
  const hardhatConfigPath = `${repoDestination}/hardhat.config.ts`
  const hardhatConfig = fs.readFileSync(hardhatConfigPath, 'utf8')
  const newHardhatConfig =
    'import "@solarity/hardhat-markup";\n' + hardhatConfig
  fs.writeFileSync(hardhatConfigPath, newHardhatConfig, 'utf8')

  // Generate the markdown files:
  shell.exec(`cd ${repoDestination} && npx hardhat markup`)
  
  // Copy the generated markdown files to the destination:
  shell.mkdir('-p', mdDestination)
  shell.cp(
    '-R',
    `${repoDestination}/generated-markups/${
      moduleName === 'recovery'
        ? 'candide-contracts/contracts/*'
        : 'contracts/*'
    }`,
    mdDestination
  )
    // Flatten the directory structure;
    // shell.exec(
    //   `find ${mdDestination}/ -mindepth 2 -type f -exec mv -i -f '{}' ${mdDestination}/ ';'`
    // )
    // shell.exec(`cd ${mdDestination} && find . -type d -empty -delete`)
}

const cloneRepo = (
  repoUrl: string,
  repoDestination: string,
  mdDestination: string
) => {
  const source = repoDestination + '/' + repoDestination
  shell.exec(`git clone ${repoUrl} ${repoDestination}`)
  const paths = walkPath(source)
    .map(p => p.replace(source, ''))
    .filter(p => !p.includes('test/'))

  shell.rm('-rf', mdDestination)
  if (repoDestination === 'contracts') {
    shell.exec(`cd ${repoDestination} && git checkout release/v1.4.1`) // until the release branch is merged with main
    generateMarkdownFromNatspec(repoDestination, mdDestination)
  } else {
    const modules = paths
      .map(p => p.split('/')[1])
      .filter((path, i, arr) => arr.indexOf(path) === i)
    modules.forEach(module => {
      generateMarkdownFromNatspec(
        `${source}/${module}`,
        `${mdDestination}/${module}`,
        module
      )
    })
  }
  shell.rm('-rf', repoDestination)
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
