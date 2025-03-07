const fs = require('fs')
const shell = require('shelljs')
const path = require('path')
const capitalize = require('lodash/capitalize')

type ParamType = { name: string; type: string; description: string }
type DocContent = {
  contractName: string
  eventName?: string
  functionName?: string
  contents: string
}

const smartAccountVersions = ['v1.3.0', 'v1.4.1'] // Earlier versions don't support hardhat
const ignoredFunctions = [
  'checkAfterExecution',
  'checkTransaction',
  'mastercopy',
  'VERSION',
  'proxyCreated'
]
const sampleValues = {
  address: '0x...',
  'address[]': '["0x..."]',
  uint256: '0',
  'uint256[]': '[0]',
  bytes: '"0x..."',
  'enum Enum.Operation': '0',
  bytes32: '"0x..."',
  bool: 'true',
  string: '"..."'
}
const functionCategories = {
  setup: ['domainSeparator', 'setup'],
  owners: [
    'addOwnerWithThreshold',
    'changeThreshold',
    'getOwners',
    'getThreshold',
    'isOwner',
    'removeOwner',
    'swapOwner'
  ],
  transactions: [
    'encodeTransactionData',
    'execTransaction',
    'getTransactionHash',
    'simulateAndRevert'
  ],
  modules: [
    'enableModule',
    'disableModule',
    'execTransactionFromModule',
    'execTransactionFromModuleReturnData',
    'getModulesPaginated',
    'isModuleEnabled'
  ],
  guards: ['setGuard', 'setModuleGuard'],
  fallbackHandler: ['fallback', 'receive', 'setFallbackHandler'],
  signatures: [
    'approveHash',
    'checkNSignatures',
    'checkSignatures',
    'signedMessages'
  ],
  utilities: ['getStorageAt']
}

// Recursively find all line numbers where the searchString occurs in the file
function findLinesInFile(file: string, searchString: string): number[] {
  const lines: number[] = [] // Array to store line numbers of matches

  try {
    const fileContent = fs.readFileSync(file, 'utf8')
    const allLines = fileContent.split('\n')

    function recursiveSearch(linesArray: string[], currentIndex: number): void {
      if (currentIndex >= linesArray.length) return // Base case for recursion

      if (linesArray[currentIndex].includes(searchString)) {
        lines.push(currentIndex + 1) // Add the line number to the array, adjusting for zero-based index
      }

      recursiveSearch(linesArray, currentIndex + 1) // Recursive call with incremented index
    }

    recursiveSearch(allLines, 0) // Start the recursion from the first line
  } catch (error) {
    console.error(`Error reading file ${file}:`, error.message)
  }

  return lines
}

function findFunctionNameInFile(file: string, functionName: string) {
  try {
    const fileContent = fs.readFileSync(file, 'utf8')
    const emitLines = findLinesInFile(file, 'emit ')
    const lines = fileContent.split('\n')
    // Check if the search string is found in the file
    if (emitLines == null) throw new Error('No events found in this file')

    const events: string[] = []
    emitLines.forEach(emitLineNumber => {
      let i = emitLineNumber - 1
      // Move up to the function definition:
      while (!lines[i].includes('function ')) {
        i--
      }
      if (lines[i].includes('function ' + functionName + '(')) {
        return events.push(
          lines[emitLineNumber - 1].split('emit ')[1].split('(')[0]
        )
      }
    })
    return events.filter(event => event.split(' ').length === 1)
  } catch (error) {
    console.error(`Error reading file ${file}:`, error.message)
    return []
  }
}

// Explore a given directory recursively and return all the file paths
const walkPath = (dir: string) => {
  let results: string[] = []
  try {
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
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }

  return results
}

// Generate the overview page for each version number
const generateOverviewPage = async (version: string, destination: string) => {
  const overviewPage = `${version !== 'v1.4.1' ? `import LegacyCallout from '../../../components/callouts/LegacyCallout.mdx'\n\n<LegacyCallout />\n\n` : ''}# Safe Smart Account  v\`${version.slice(1)}\` - Reference

This reference lists all public functions and events of the [Safe Smart Account](../advanced/smart-account-overview.mdx) contracts version \`${version.slice(1)}\`, logically clustered.

`
  await shell.exec(`mkdir -p ${destination}`, { async: true }, async () => {
    fs.appendFileSync(`${destination}/overview.mdx`, overviewPage, 'utf8')
  })
}

const generateMetaJson = async (
  destination: string,
  categories: string[],
  callback: () => Promise<void>
) => {
  const metaJson = Object.fromEntries(
    categories.map(v => [
      v,
      {
        title: v,
        type: 'page',
        display: 'hidden'
      }
    ])
  )
  shell.exec(`mkdir -p ${destination}`, { async: true }, async () => {
    fs.writeFileSync(
      `${destination}/_meta.json`,
      JSON.stringify(metaJson, null, 2),
      'utf8'
    )
    await callback()
  })
}

// Generate the _meta.json file for each version number
const generateMetaJsonVersions = (version: string, destination: string) => {
  const categories = Object.keys(functionCategories)
  const content = Object.fromEntries([
    [
      'home',
      {
        title: '← Go Back',
        href: '/advanced/smart-account-overview'
      }
    ],
    ['overview', 'Overview'],
    [
      '-- Safe Reference',
      {
        type: 'separator',
        title: 'Safe Reference'
      }
    ],
    ['events', { title: 'Events', type: 'page', display: 'hidden' }],
    ...[...categories, 'other'].map(category => [
      category,
      capitalize(category)
    ])
  ])
  fs.writeFileSync(
    `${destination}/_meta.json`,
    JSON.stringify(content, null, 2),
    'utf8'
  )
}

// Generate the _meta.json file for each category
const generateMetaJsonCategories = (destination: string) => {
  const categories = Object.entries(functionCategories)
  categories.forEach(([category, functions]) => {
    const content = Object.fromEntries(
      functions.map(functionName => [functionName, functionName])
    )
    fs.writeFileSync(
      `${destination}/${category}/_meta.json`,
      JSON.stringify(content, null, 2),
      'utf8'
    )
  })
}

// Setup Solarity to generate documentation from a given repository in solidity
const setupSolarity = async ({
  repoDestination,
  moduleName,
  callback
}: {
  repoDestination: string
  moduleName?: string
  callback: () => Promise<void>
}) => {
  // Install the dependencies and add the @solarity/hardhat-markup plugin
  await shell.exec(
    `cd ${repoDestination} && ${moduleName !== null ? 'pnpm' : 'yarn'} add @solarity/hardhat-markup`,
    { async: true },
    async () => {
      // Add the plugin to the hardhat.config.ts file
      const hardhatConfigPath = `${repoDestination}/hardhat.config.ts`
      const hardhatConfig = fs.readFileSync(hardhatConfigPath, 'utf8')
      const newHardhatConfig =
        'import "@solarity/hardhat-markup";\n' + hardhatConfig
      fs.writeFileSync(hardhatConfigPath, newHardhatConfig, 'utf8')
      await callback()
    }
  )
}

const getDescrptionCallouts = (description: string) =>
  description
    .replace(
      'This can only be done via a Safe transaction.',
      '<OnlySafeTxCallout />'
    )
    .replace(
      'Since the EIP-1271 does an external call, be mindful of reentrancy attacks.',
      '<ReentrancyCallout />'
    )
    .replace(
      "IMPORTANT: The approved hash stays approved forever. There's no revocation mechanism, so it behaves similarly to ECDSA signatures",
      '<IrreversibilityCallout />'
    )

const getSafeDocsTemplate = ({
  functionName,
  functionSignature,
  functionEvents,
  functionDescription,
  functionDefinition,
  functionParameters,
  functionReturnTypes,
  contractName,
  contractPath,
  version,
  repoUrl,
  moduleName
}: {
  functionName?: string
  functionSignature: string
  functionEvents: string[]
  functionDescription: string
  functionDefinition: string
  functionParameters: ParamType[]
  functionReturnTypes: ParamType[]
  contractName: string
  contractPath: string
  version?: string
  repoUrl: string
  moduleName?: string
}) => `import { Tabs, Callout } from 'nextra/components'
${functionEvents?.map(event => `import ${event} from '${moduleName == null ? '..' : '.'}/events/${event}.mdx'`).join('\n')}
import LegacyCallout from '${moduleName == null ? '..' : '.'}/../../../components/callouts/LegacyCallout.mdx'
import OnlySafeTxCallout from '${moduleName == null ? '..' : '.'}/../../../components/callouts/OnlySafeTxCallout.mdx'
import ReentrancyCallout from '${moduleName == null ? '..' : '.'}/../../../components/callouts/ReentrancyCallout.mdx'
import IrreversibilityCallout from '${moduleName == null ? '..' : '.'}/../../../components/callouts/IrreversibilityCallout.mdx'

${version !== 'v1.4.1' ? `<LegacyCallout />` : ''}

# \`${functionName}\` ${functionSignature}

${getDescrptionCallouts(functionDescription)}

Defined in [\`${contractName}.sol\`](${repoUrl}tree/${version}/${contractPath}#L${findLinesInFile('contracts/' + contractPath, 'function ' + functionName)[0] ?? findLinesInFile('contracts/' + contractPath, functionName as string)[0]})\n

## Usage

{/* <!-- vale off --> */}

<Tabs items={['example.sol']}>
  <Tabs.Tab>
    \`\`\`solidity
    interface ISafe {
        ${functionDefinition}
    }

    contract Example {
        function example() ... {
            (ISafe safe).${functionName}(${
              functionParameters.length === 0
                ? ');'
                : `
                ${functionParameters.map(p => sampleValues[p.type as 'uint256']).join(',\n                ')}
            );`
            }
        }
    }
    \`\`\`
  </Tabs.Tab>
</Tabs>

{/* <!-- vale on --> */}

${
  functionReturnTypes.length > 0
    ? `## Returns

${functionReturnTypes
  ?.map(
    ({ name, type, description }, index) =>
      `${name !== '[0]' ? `### \`${name}\`` : ''}

  - **Type:** \`${type}\`

  ${description}

`
  )
  .join('\n')}
`
    : ''
}

${
  functionParameters.length > 0
    ? `## Parameters

${functionParameters
  ?.map(
    ({ name, type, description }, index) =>
      `### \`${name}\`

  - **Type:** \`${type}\`

  ${description}

  \`\`\`solidity focus=${index + 2}
  (ISafe safe).${functionName}(
    ${functionParameters.map(p => sampleValues[p.type as 'uint256']).join(',\n    ')}
  );
  \`\`\`

`
  )
  .join('\n')}
`
    : ''
}

${
  functionEvents.length === 0
    ? ''
    : `## Events

${functionEvents.map(event => `<${event} />`).join('\n')}
`
}
`

const getParameters = (functionDoc: string) => {
  const functionParameterStrings =
    functionDoc
      ?.split('|')
      .filter(p => p.replaceAll('\n', '') !== '')
      .map(p => p.trim())
      .filter(p => !p.includes(':-') && p != null)
      .slice(3) ?? []
  const names: string[] = []
  const types: string[] = []
  const descriptions: string[] = []
  for (let i = 0; i < functionParameterStrings.length; i++) {
    if (i % 3 === 0) {
      names.push(functionParameterStrings[i])
    } else if (i % 3 === 1) {
      types.push(functionParameterStrings[i])
    } else {
      descriptions.push(functionParameterStrings[i])
    }
  }
  // Extract function parameters
  const parameters: ParamType[] = []
  for (let i = 0; i < names.length; i += 3) {
    const name = names[i]
    const type = types[i]
    const description = descriptions[i]
    parameters.push({
      name,
      type,
      description: description?.replaceAll('{', '\\{').replaceAll('}', '\\}')
    })
  }
  return parameters
}

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
  const publicFunctions: DocContent[] = []
  const publicEvents: DocContent[] = []
  const solarityFilesPaths = walkPath(
    `${repoDestination}/generated-markups/${
      moduleName === 'recovery' ? 'candide-contracts/contracts' : 'contracts'
    }`
  ).filter(
    p => p.endsWith('.md') && !p.includes('test') && !p.includes('examples')
  )

  // Generate .mdx pages:
  solarityFilesPaths.forEach(solarityFilePath => {
    // Prepare content
    const content: string = fs.readFileSync(solarityFilePath, 'utf8')
    const lines = content?.split('\n')

    // Extract content from @solarity .md files
    const contractName = lines[0].replace('#', '')
    const titles = content?.split('\n## ')
    const _publicFunctions = titles
      .filter(t => t.startsWith('Functions info'))
      .map(t => t?.split('### '))
      .flat()
      .filter(t => t.includes('public') || t.includes('external'))
      .map(functionDoc => {
        const contentLines = functionDoc?.split('\n')
        const functionName = contentLines[0]?.split(' ')[0]
        const functionSignature = contentLines[0]?.split(' ')[1]
        const functionDefinition = functionDoc
          ?.split('```solidity')[1]
          ?.split('```')[0]
          .replaceAll('\n', '')
          .replaceAll('    ', '')

        const functionDescription = functionDoc
          ?.split('```')[2]
          ?.split('Parameters')[0]
          ?.split('Return values')[0]
          .replaceAll('{', '\\{')
          .replaceAll('}', '\\}')

        const functionParameters = getParameters(
          functionDoc?.split('Parameters:')[1]?.split('Return values')[0]
        )

        const functionReturnTypes = getParameters(
          functionDoc?.split('Return values:')[1]
        )

        // Extract function events
        const functionEvents = findFunctionNameInFile(
          solarityFilePath
            .replace('.md', '.sol')
            .replace('/generated-markups', ''),
          functionName
        )
        console.log(functionEvents)
        const safeDocMdxPage = getSafeDocsTemplate({
          functionName,
          functionSignature,
          functionDescription,
          functionEvents,
          functionDefinition,
          functionParameters,
          functionReturnTypes,
          contractName,
          contractPath: solarityFilePath
            .replace('.md', '.sol')
            .replace('/generated-markups/contracts', ''),
          version,
          repoUrl,
          moduleName
        })

        return {
          contractName,
          functionName,
          contents: safeDocMdxPage
        }
      })

    const _publicEvents = titles
      .filter(t => t.startsWith('Events info'))
      .map(t => t.split('### '))
      .flat()
      .map(eventDoc => {
        const contentLines = eventDoc.split('\n')
        return contentLines.join('\n')
      })
    // Adds to the global list of public functions
    publicFunctions.push(..._publicFunctions)

    // Adds to the global list of public events
    if (_publicEvents.length > 0) {
      publicEvents.push(
        ..._publicEvents.map(contents => {
          const eventName = contents.split('\n')[0]
          return {
            contractName,
            eventName,
            contents:
              `### \`${eventName}\`` + contents.slice(eventName.length + 1)
          }
        })
      )
    }
  })

  // If there are the same function name in multiple files, we will keep only the one with the longest content.
  const dedupeReducer = (acc: DocContent[], curr: DocContent) => {
    const existingFunction = acc.find(f => f.functionName === curr.functionName)
    if (existingFunction) {
      if (curr.contents.length > existingFunction.contents.length) {
        return acc.map(f => (f.functionName === curr.functionName ? curr : f))
      }
    } else {
      acc.push(curr)
    }
    return acc
  }
  const dedupedPublicFunctions = publicFunctions.reduce(dedupeReducer, [])

  // Generate one file per function
  dedupedPublicFunctions.forEach(
    async ({ contractName, functionName, contents }) => {
      if (ignoredFunctions.includes(functionName ?? '')) return
      if (moduleName == null) {
        const category =
          Object.entries(functionCategories).find(
            ([categoryName, categories]) =>
              categories.includes(functionName ?? '')
          )?.[0] || 'other'
        const directory = `${mdDestination}/${category}`
        const filePath = directory + `/${functionName}.mdx`

        // Save file
        shell.exec(`mkdir -p ${directory}`, { async: true }, async () => {
          fs.appendFileSync(filePath, contents, 'utf8')
        })
      } else {
        // Save file
        shell.exec(`mkdir -p ${mdDestination}`, { async: true }, async () => {
          fs.appendFileSync(
            mdDestination + `/${functionName}.mdx`,
            contents,
            'utf8'
          )
        })
      }
    }
  )

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

  if (moduleName == null) generateMetaJsonCategories(mdDestination) // Generate a _meta.json file per category
  await callback()
}

// Takes a GitHub repository with Solidity contracts and generates documentation for each public function and event
const generateSolidityReference = async (
  repoUrl: string,
  repoDestination: string,
  mdDestination: string
) => {
  // Prepare files
  shell.rm('-rf', mdDestination)
  const source = repoDestination + '/' + repoDestination
  await shell.exec(
    `git clone ${repoUrl} ${repoDestination}`,
    { async: true },
    async () => {
      if (repoDestination === 'contracts') {
        const generateVersionReference = async (
          version: string,
          callback: () => Promise<void>
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
                                    await callback()
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
        async function processAllVersions(list: string[]) {
          if (list.length == 0) {
            // Clean up temporary files
            shell.rm('-rf', repoDestination)
            return
          }
          return await generateVersionReference(list[0], async () => {
            generateMetaJson(
              mdDestination,
              smartAccountVersions,
              async () => await processAllVersions(list.slice(1, list.length))
            )
          })
        }
        await processAllVersions(smartAccountVersions)
      } else {
        const paths = walkPath(source)
          .map(p => p.replace(source, ''))
          .filter(p => !p.includes('test/'))
        const modules = paths
          .map(p => p.split('/')[1])
          .filter((path, i, arr) => arr.indexOf(path) === i)
        await shell.exec(
          `cd ${repoDestination} && pnpm i`,
          { async: true },
          async () =>
            await Promise.all(
              modules.map(async moduleName => {
                const _repoDestination = `${source}/${moduleName}`
                const _mdDestination = `${mdDestination}/${moduleName}`
                const _repoUrl = repoUrl + '/modules/' + moduleName
                // Prepare repo & generate .md doc files using @solarity:
                await setupSolarity({
                  repoDestination: _repoDestination,
                  moduleName,
                  callback: async () => {
                    await shell.exec(
                      `cd ${_repoDestination} && pnpm exec hardhat markup`,
                      { async: true },
                      async () => {
                        // Generate final .mdx files
                        await generateMarkdownFromNatspec({
                          repoDestination: _repoDestination,
                          mdDestination: _mdDestination,
                          repoUrl: _repoUrl,
                          moduleName,
                          callback: async () => {
                            await generateOverviewPage(
                              moduleName,
                              _mdDestination
                            )
                            await generateMetaJsonVersions(
                              moduleName,
                              _mdDestination
                            )
                            await generateMetaJson(
                              mdDestination,
                              ['4337', 'allowances', 'passkey', 'recovery'],
                              async () => {}
                            )
                          }
                        })
                      }
                    )
                  }
                })
              })
            )
        )
      }
    }
  )
}

const main = async () => {
  generateSolidityReference(
    `https://github.com/safe-global/safe-smart-account/`,
    'contracts',
    'pages/reference-smart-account'
  )
  generateSolidityReference(
    `https://github.com/safe-global/safe-modules/`,
    'modules',
    'pages/reference-modules'
  )
}

void main()
