import fs from 'fs'
import shell from 'shelljs'

import { dedupeReducer, findFunctionNameInFile, walkPath } from './utils'
import { getSafeDocsTemplate } from './templates'
import type { DocContent, ParamType } from './types'
import { generateMetaJsonCategories } from './metaJsons'
import natSpecOverrides from './natSpecOverrides.json'
import {
  ignoredFunctions,
  modulesCategories,
  smartAccountCategories
} from './constants'
import { sanitizeMdx } from '../mdx'

export interface NatSpecOverride {
  natSpec: string
  returnTypes?: string[]
  parameters?: string[]
}

// Setup Solarity to generate documentation from a given repository in solidity
export const setupSolarity = ({
  repoDestination,
  moduleName,
  callback
}: {
  repoDestination: string
  moduleName?: string
  callback: () => void
}): void => {
  shell.exec(
    // Install the dependencies and add the @solarity/hardhat-markup plugin
    `cd ${repoDestination} && ${moduleName !== null ? 'npx pnpm@9' : 'yarn'} add @solarity/hardhat-markup`,
    { async: true },
    () => {
      // Add the plugin to the hardhat.config.ts file
      const hardhatConfigPath = `${repoDestination}/hardhat.config.ts`
      const hardhatConfig = fs.readFileSync(hardhatConfigPath, 'utf8')
      const newHardhatConfig =
        'import "@solarity/hardhat-markup";\n' + hardhatConfig
      fs.writeFileSync(hardhatConfigPath, newHardhatConfig, 'utf8')
      callback()
    }
  )
}

export const getParametersFromMdTable = (
  functionDoc: string,
  overrides: NatSpecOverride
): ParamType[] => {
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
  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    const type = types[i]
    const description = overrides.returnTypes?.[i] ?? descriptions[i]
    parameters.push({
      name,
      type,
      description: sanitizeMdx(description)
    })
  }
  return parameters
}

export const getPublicFunctionsAndEvents = ({
  repoUrl,
  repoDestination,
  version
}: {
  repoUrl: string
  repoDestination: string
  version: string
}): {
  publicFunctions: DocContent[]
  publicEvents: DocContent[]
} => {
  // Format files so they adhere to Safe docs standards
  const publicFunctions: DocContent[] = []
  const publicEvents: DocContent[] = []
  const solarityFilesPaths = walkPath(
    `${repoDestination}/generated-markups/${
      version.includes('recovery') ? 'candide-contracts/contracts' : 'contracts'
    }`
  )
    .filter(
      p =>
        p.endsWith('.md') &&
        !p.includes('test') &&
        !p.includes('examples') &&
        (p.includes('ISafeSignerFactory') ? true : !p.includes('interfaces')) &&
        !p.includes('vendor/FCL')
    )
    .filter(p =>
      version.includes('/') ? p.includes(version.split('/')[0]) : true
    )

  // Generate .mdx pages:
  solarityFilesPaths.forEach(solarityFilePath => {
    try {
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
          const overrides: NatSpecOverride =
            natSpecOverrides?.[
              repoUrl as 'https://github.com/safe-global/safe-smart-account/'
            ]?.[version as 'v1.4.1']?.[functionName as 'execTransaction']

          const functionSignature = contentLines[0]?.split(' ')[1]
          const functionDefinition = functionDoc
            ?.split('```solidity')[1]
            ?.split('```')[0]
            .replaceAll('    ', '            ')
            .replace('\n', '')
            .trim()
            .replace('\n)', '\n        )')
          const functionDescription: string =
            overrides.natSpec ??
            functionDoc
              ?.split('```')[2]
              ?.split('Parameters')[0]
              ?.split('Return values')[0]
          const functionParameters = getParametersFromMdTable(
            functionDoc?.split('Parameters:')[1]?.split('Return values')[0],
            overrides
          )

          const functionReturnTypes = getParametersFromMdTable(
            functionDoc?.split('Return values:')[1],
            overrides
          )

          // Extract function events
          const functionEvents = findFunctionNameInFile(
            solarityFilePath
              .replace('.md', '.sol')
              .replace('/generated-markups', ''),
            functionName
          )
          const safeDocMdxPage = getSafeDocsTemplate({
            functionName,
            functionSignature,
            functionDescription: sanitizeMdx(functionDescription),
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
            repoDestination
          })

          return {
            contractName,
            functionName,
            contents: safeDocMdxPage
          }
        })
      // Adds to the global list of public functions
      publicFunctions.push(..._publicFunctions)

      const _publicEvents = titles
        .filter(t => t.startsWith('Events info'))
        .map(t => t.split('### '))
        .flat()
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
    } catch (error) {
      console.error(
        `Error getting public functions and events in file ${solarityFilePath}:`,
        error.message
      )
    }
  })

  const dedupedPublicFunctions = publicFunctions.reduce(dedupeReducer, [])

  return { publicFunctions: dedupedPublicFunctions, publicEvents }
}

export const generateMarkdownFromNatspec = ({
  repoDestination,
  mdDestination,
  repoUrl,
  version,
  callback
}: {
  repoDestination: string
  mdDestination: string
  repoUrl: string
  version: string
  callback: () => void
}): void => {
  // Format files so they adhere to Safe docs standards
  const { publicFunctions, publicEvents } = getPublicFunctionsAndEvents({
    repoUrl,
    repoDestination,
    version
  })

  // Generate one file per function
  publicFunctions.forEach(({ contractName, functionName, contents }) => {
    if (ignoredFunctions.includes(functionName ?? '')) return
    const category =
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      Object.entries(
        version.includes('/')
          ? modulesCategories[version.split('/')[0] as '4337']
          : smartAccountCategories
      ).find(
        ([, categories]) => categories.includes(functionName ?? '')
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      )?.[0] || 'other'
    const directory = `${mdDestination}/${category}`
    const filePath = directory + `/${functionName}.mdx`

    // Save file
    shell.exec(`mkdir -p ${directory}`, { async: true }, async () => {
      fs.appendFileSync(
        filePath,
        contents
          .replaceAll('e.g.', 'for example')
          .replaceAll('addressess', 'addresses')
          .replaceAll('auto-start', 'autostart'),
        'utf8'
      )
    })
  })

  // Generate one file per event
  publicEvents.forEach(({ eventName, contents }) => {
    const directory = `${mdDestination}/events`
    const filePath = directory + `/${eventName}.mdx`

    // Save file
    shell.exec(`mkdir -p ${directory}`, { async: true }, async () => {
      fs.writeFileSync(filePath, sanitizeMdx(contents), 'utf8')
    })
  })

  // Generate a _meta.json file per category
  generateMetaJsonCategories(
    mdDestination,
    publicFunctions.map(publicFunction => publicFunction.functionName ?? ''),
    version
  )
  callback()
}
