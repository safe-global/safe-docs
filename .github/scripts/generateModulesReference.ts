import shell from 'shelljs'

import { modulesVersions } from '../../lib/solidity/constants.ts'
import {
  generateMarkdownFromNatspec,
  setupSolarity
} from '../../lib/solidity/solarity.ts'
import {
  generateOverviewPageModule,
  runSolidityGenerationScript
} from '../../lib/solidity/templates.ts'
import {
  generateMetaJson,
  generateMetaJsonVersionsModule
} from '../../lib/solidity/metaJsons.ts'

const repoUrl = 'https://github.com/safe-global/safe-modules/'
const repoDestination = '.temp/safe-modules'
const mdDestination = 'pages/reference-modules'
const versions = Object.entries(modulesVersions).reduce(
  (acc, [moduleName, versions]) => {
    versions.forEach(version => {
      acc.push(moduleName + '/' + version)
    })
    return acc
  },
  [] as string[]
)

// Clones the safe-modules GitHub repository and generates documentation for each public function and event
const generateModulesReference = (
  version: string,
  callback: () => void,
  repoDestination: string,
  mdDestination: string
) => {
  // Prepare files
  const moduleName = version.split('/')[0]
  const _version = version.split('/')[1]
  const _repoDestination = `${repoDestination}/modules/${moduleName === 'allowance' ? 'allowances' : moduleName}`
  const _mdDestination = `${mdDestination}/${moduleName}/${_version}`
  const _repoUrl = `${repoUrl}tree/${version}/`
  shell.exec(
    `cd ${repoDestination} && git checkout tags/${version} && npx pnpm@9 i`,
    { async: true },
    async () => {
      // Prepare repo & generate .md doc files using @solarity:
      setupSolarity({
        repoDestination: _repoDestination,
        moduleName,
        callback: () => {
          shell.exec(
            `cd ${_repoDestination} && npx pnpm@9 exec hardhat markup && mkdir -p ${_mdDestination}`,
            { async: true },
            () => {
              // Generate final .mdx files
              generateMarkdownFromNatspec({
                repoDestination: _repoDestination,
                mdDestination: _mdDestination,
                repoUrl,
                version,
                callback: async () => {
                  generateOverviewPageModule(version, _mdDestination, _repoUrl)
                  generateMetaJsonVersionsModule(moduleName, _mdDestination)
                  generateMetaJson(
                    `${mdDestination}/${moduleName}`,
                    [_version],
                    () => {
                      // Remove all changes to the git index so we can git checkout different branches again
                      shell.exec(
                        `rm -rf ${_repoDestination}/build && rm -rf ${_repoDestination}/node_modules && rm -rf ${_repoDestination}/generated-markups && cd ${repoDestination} && rm -f pnpm-lock.yaml && git stash && git stash drop`,
                        { async: true },
                        callback
                      )
                    }
                  )
                }
              })
            }
          )
        }
      })
    }
  )
}

void runSolidityGenerationScript(
  mdDestination,
  repoDestination,
  repoUrl,
  versions,
  generateModulesReference
)
