import fs from 'fs'
import shell from 'shelljs'
import { capitalize } from 'lodash'

import { ParamType } from './types'
import { findLinesInFile } from './utils'
import { sampleValues } from './constants'
import { generateMetaJson } from './metaJsons'

// Generate the overview page for each version number
export const generateOverviewPage = async (
  version: string,
  destination: string
) => {
  const overviewPage = `${version !== 'v1.4.1' ? `import LegacyCallout from '../../../components/callouts/LegacyCallout.mdx'\n\n<LegacyCallout />\n\n` : ''}# Safe Smart Account  \`${version}\` - Reference

This reference lists all public functions and events of the [Safe Smart Account](../advanced/smart-account-overview.mdx) contracts version \`${version.slice(1)}\`, logically clustered.

`
  await shell.exec(`mkdir -p ${destination}`, { async: true }, async () => {
    fs.appendFileSync(`${destination}/overview.mdx`, overviewPage, 'utf8')
  })
}

// Generate the overview page for each version number
export const generateOverviewPageModule = async (
  version: string,
  destination: string
) => {
  const moduleName = version.split('/')[0]
  const _version = version.split('/')[1]

  const overviewPage = `${_version !== 'v1.4.1' ? `import LegacyCallout from '../../../../components/callouts/LegacyCallout.mdx'\n\n<LegacyCallout />\n\n` : ''}# ${capitalize(moduleName)} Module \`${_version}\` - Reference

This reference lists all public functions and events of the [Safe Smart Account](../advanced/smart-account-overview.mdx)'} contracts version \`${_version.slice(1)}\`, logically clustered.

`
  await shell.exec(`mkdir -p ${destination}`, { async: true }, async () => {
    fs.appendFileSync(`${destination}/overview.mdx`, overviewPage, 'utf8')
  })
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

export const getSafeDocsTemplate = ({
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
  repoDestination
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
  version: string
  repoUrl: string
  moduleName?: string
  repoDestination: string
}) => `import { Tabs, Callout } from 'nextra/components'
${functionEvents?.map(event => `import ${event} from '../events/${event}.mdx'`).join('\n')}
import LegacyCallout from '${version.includes('/') ? '../..' : '..'}/../../../components/callouts/LegacyCallout.mdx'
import OnlySafeTxCallout from '${version.includes('/') ? '../..' : '..'}/../../../components/callouts/OnlySafeTxCallout.mdx'
import ReentrancyCallout from '${version.includes('/') ? '../..' : '..'}/../../../components/callouts/ReentrancyCallout.mdx'
import IrreversibilityCallout from '${version.includes('/') ? '../..' : '..'}/../../../components/callouts/IrreversibilityCallout.mdx'

${version !== 'v1.4.1' ? `<LegacyCallout />` : ''}

# \`${functionName}\` ${functionSignature}

${getDescrptionCallouts(functionDescription)}

Defined in [\`${contractName}.sol\`](${repoUrl}tree/${version}/${contractPath.replace('.temp/', '')}#L${findLinesInFile(contractPath.replace(repoDestination, repoDestination + '/contracts'), 'function ' + functionName)[0] ?? findLinesInFile(contractPath.replace(repoDestination, repoDestination + '/contracts'), functionName as string)[0]})\n

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

// Recursively process all versions to ensure operations (cloning, installing deps, etc.) are done sequentially:
export const processAllVersions = async ({
  list,
  mdDestination,
  repoDestination,
  versions,
  generateFunction
}: {
  list: string[]
  mdDestination: string
  repoDestination: string
  versions: string[]
  generateFunction: (
    version: string,
    callback: () => Promise<void>,
    repoDestination: string,
    mdDestination: string
  ) => Promise<void>
}) => {
  if (list.length == 0) {
    // Clean up temporary files
    shell.rm('-rf', repoDestination)
    return
  }
  console.info('Processing version:', list[0])
  return await generateFunction(
    list[0],
    async () => {
      generateMetaJson(
        mdDestination,
        versions,
        async () =>
          await processAllVersions({
            list: list.slice(1, list.length),
            mdDestination,
            repoDestination,
            versions,
            generateFunction
          })
      )
    },
    repoDestination,
    mdDestination
  )
}

// Takes a GitHub repository with Solidity contracts and generates documentation for each public function and event
export const runSolidityGenerationScript = (
  mdDestination,
  repoDestination,
  repoUrl,
  versions,
  generateFunction
) => {
  // Prepare files
  shell.rm('-rf', mdDestination)
  shell.exec(
    `git clone ${repoUrl} ${repoDestination}`,
    { async: true },
    async () => {
      await processAllVersions({
        list: versions,
        mdDestination,
        repoDestination,
        versions,
        generateFunction
      })
    }
  )
}
