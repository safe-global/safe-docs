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

const generateSmartAccountReference = async (
  version: string,
  callback: () => Promise<void>,
  repoDestination: string,
  mdDestination: string
) => {
  await shell.exec(
    `cd ${repoDestination} && git checkout tags/${version}`,
    { async: true },
    async () => {
      // Prepare repo & generate .md doc files using @solarity:
      await setupSolarity({
        repoDestination,
        callback: async () => {
          await shell.exec(
            `cd ${repoDestination} && npx hardhat markup && mkdir -p ${mdDestination}`,
            {
              async: true
            },
            async () => {
              // Generate final .mdx files
              await generateMarkdownFromNatspec({
                repoDestination,
                mdDestination: `${mdDestination}/${version}`,
                repoUrl,
                version,
                callback: async () => {
                  await generateOverviewPage(
                    version,
                    `${mdDestination}/${version}`
                  )
                  generateMetaJsonVersions(
                    version,
                    `${mdDestination}/${version}`
                  )
                  await shell.exec(
                    `rm -rf ${repoDestination}/build && rm -rf ${repoDestination}/node_modules && rm -rf ${repoDestination}/generated-markups && cd ${repoDestination} && git stash && git stash drop`,
                    { async: true },
                    async () => {
                      await callback()
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
  smartAccountVersions,
  generateSmartAccountReference
)
