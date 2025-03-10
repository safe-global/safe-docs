import fs from 'fs'
import shell from 'shelljs'

import {
  ignoredFunctions,
  smartAccountVersions,
  functionCategories
} from './solidity/constants.ts'
import {
  setupSolarity,
  getPublicFunctionsAndEvents
} from './solidity/solarity.ts'
import { generateOverviewPage } from './solidity/templates.ts'
import {
  generateMetaJson,
  generateMetaJsonVersions,
  generateMetaJsonCategories
} from './solidity/metaJsons.ts'

const repoUrl = 'https://github.com/safe-global/safe-smart-account/'
const repoDestination = '.temp/contracts'
const mdDestination = 'pages/reference-smart-account'

const generateMarkdownFromNatspec = async ({
  repoDestination,
  mdDestination,
  repoUrl,
  moduleName,
  version,
  callback
}: {
  repoDestination: string
  mdDestination: string
  repoUrl: string
  moduleName?: string
  version?: string
  callback: () => Promise<void>
}) => {
  // Format files so they adhere to Safe docs standards
  const { publicFunctions, publicEvents } = getPublicFunctionsAndEvents({
    repoUrl,
    repoDestination,
    moduleName,
    version
  })

  // Generate one file per function
  publicFunctions.forEach(async ({ contractName, functionName, contents }) => {
    if (ignoredFunctions.includes(functionName ?? '')) return
    const category =
      Object.entries(functionCategories).find(([categoryName, categories]) =>
        categories.includes(functionName ?? '')
      )?.[0] ?? 'other'
    const directory = `${mdDestination}/${category}`
    const filePath = directory + `/${functionName}.mdx`

    // Save file
    shell.exec(`mkdir -p ${directory}`, { async: true }, async () => {
      fs.appendFileSync(filePath, contents, 'utf8')
    })
  })

  // Generate one file per event
  publicEvents.forEach(({ eventName, contents }) => {
    const directory = `${mdDestination}/events`
    const filePath = directory + `/${eventName}.mdx`

    // Save file
    shell.exec(`mkdir -p ${directory}`, { async: true }, async () => {
      fs.writeFileSync(
        filePath,
        contents.replaceAll('{', '\\{').replaceAll('}', '\\}'),
        'utf8'
      )
    })
  })

  await generateMetaJsonCategories(
    mdDestination,
    publicFunctions.map(publicFunction => publicFunction.functionName as string)
  ) // Generate a _meta.json file per category
  await callback()
}

const generateVersionReference = async (
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
            `cd ${repoDestination} && npx hardhat markup`,
            {
              async: true
            },
            async () => {
              await shell.exec(
                `mkdir -p ${mdDestination}`,
                { async: true },
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
                          shell.exec(
                            `cd ${repoDestination} `,
                            { async: true },
                            async () => {
                              await callback()
                            }
                          )
                        }
                      )
                    }
                  })
                }
              )
            }
          )
        }
      })
    }
  )
}

// Recursively process all versions to ensure operations (cloning, installing deps, etc.) are done sequentially:
async function processAllVersions(
  list: string[],
  mdDestination: string,
  smartAccountVersions: string[]
) {
  if (list.length == 0) {
    // Clean up temporary files
    shell.rm('-rf', repoDestination)
    return
  }
  return await generateVersionReference(
    list[0],
    async () => {
      generateMetaJson(
        mdDestination,
        smartAccountVersions,
        async () =>
          await processAllVersions(
            list.slice(1, list.length),
            mdDestination,
            smartAccountVersions
          )
      )
    },
    repoDestination,
    mdDestination
  )
}

// Takes a GitHub repository with Solidity contracts and generates documentation for each public function and event
const main = async () => {
  // Prepare files
  shell.rm('-rf', mdDestination)
  await shell.exec(
    `git clone ${repoUrl} ${repoDestination}`,
    { async: true },
    async () => {
      await processAllVersions(
        smartAccountVersions,
        mdDestination,
        smartAccountVersions
      )
    }
  )
}

void main()
