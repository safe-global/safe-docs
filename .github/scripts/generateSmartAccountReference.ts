import shell from 'shelljs'

import { smartAccountVersions } from '../../lib/solidity/constants.ts'
import {
  setupSolarity,
  generateMarkdownFromNatspec
} from '../../lib/solidity/solarity.ts'
import {
  generateOverviewPage,
  runSolidityGenerationScript
} from '../../lib/solidity/templates.ts'
import { generateMetaJsonVersions } from '../../lib/solidity/metaJsons.ts'

const repoUrl = 'https://github.com/safe-global/safe-smart-account/'
const repoDestination = '.temp/contracts'
const mdDestination = 'pages/reference-smart-account'

const generateSmartAccountReference = (
  version: string,
  callback: () => void,
  repoDestination: string,
  mdDestination: string
) => {
  shell.exec(
    `cd ${repoDestination} && git checkout tags/${version}`,
    { async: true },
    () => {
      // Prepare repo & generate .md doc files using @solarity:
      setupSolarity({
        repoDestination,
        callback: () => {
          shell.exec(
            `cd ${repoDestination} && npx hardhat markup && mkdir -p ${mdDestination}`,
            {
              async: true
            },
            () => {
              // Generate final .mdx files
              generateMarkdownFromNatspec({
                repoDestination,
                mdDestination: `${mdDestination}/${version}`,
                repoUrl,
                version,
                callback: () => {
                  generateOverviewPage(version, `${mdDestination}/${version}`)
                  generateMetaJsonVersions(
                    version,
                    `${mdDestination}/${version}`
                  )
                  shell.exec(
                    `rm -rf ${repoDestination}/build && rm -rf ${repoDestination}/node_modules && rm -rf ${repoDestination}/generated-markups && cd ${repoDestination} && git stash && git stash drop`,
                    { async: true },
                    callback
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
  smartAccountVersions,
  generateSmartAccountReference
)
