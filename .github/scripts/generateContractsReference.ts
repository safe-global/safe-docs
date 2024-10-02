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

const cloneRepo = (repoUrl: string, repoDestination: string) => {
  const source = repoDestination + '/' + repoDestination
  shell.exec(`git clone ${repoUrl} ${repoDestination}`)
  const paths = walkPath(source)
    .map(p => p.replace(source, ''))
    .filter(p => !p.includes('test/'))

  const natspec = getContractsNatspec(paths, repoDestination, source)

  shell.rm('-rf', repoDestination)
  return natspec
}

const getContractsNatspec = (
  paths: string[],
  type: string,
  destination: string
) => {
  const contracts: any = []

  paths
    .filter(p => p.endsWith('.sol'))
    .forEach(p => {
      const natspec = shell
        .exec(`solc --userdoc ${destination}/${p}`)
        .stdout.split('======= contracts/contracts/')[1]
        .split('=======')[1]
        .split('User Documentation')[1]
        .trim()
      contracts.push({ ...JSON.parse(natspec), contract: p })
    })

  fs.writeFileSync(
    'components/ContractsReference/' + type + '.json',
    JSON.stringify(contracts, null, 2),
    'utf8'
  )
}

const main = () => {
  cloneRepo(`https://github.com/safe-global/safe-smart-account/`, 'contracts')
  cloneRepo(`https://github.com/safe-global/safe-modules/`, 'modules')
}

main()
