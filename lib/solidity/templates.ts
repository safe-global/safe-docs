import fs from 'fs'
import shell from 'shelljs'
import { capitalize } from 'lodash'

import { findLinesInFile } from './utils'
import { sampleValues } from './constants'
import { generateMetaJson } from './metaJsons'
import type { ParamType } from './types'

// Generate the overview page for each version number
export const generateOverviewPage = async (
  version: string,
  destination: string
): Promise<void> => {
  const overviewPage = `${version !== 'v1.4.1' ? `import LegacyCallout from '../../../components/callouts/LegacyCallout.mdx'\n\n<LegacyCallout />\n\n` : ''}# Safe Smart Account  \`${version}\` - Reference

This reference lists all public functions and events of the [Safe Smart Account](../advanced/smart-account-overview.mdx) contracts version \`${version.slice(1)}\`, logically clustered.

`
  shell.exec(`mkdir -p ${destination}`, { async: true }, async () => {
    fs.appendFileSync(`${destination}/overview.mdx`, overviewPage, 'utf8')
  })
}

// Generate the overview page for each version number
export const generateOverviewPageModule = (
  version: string,
  destination: string,
  repoUrl: string
): void => {
  const moduleName = version.split('/')[0]
  const _version = version.split('/')[1]

  const overviewPage = `# ${capitalize(moduleName)} Module \`${_version}\` - Reference

This reference lists all public functions and events of the [Safe ${moduleName} Module](${repoUrl}) contracts version \`${_version.slice(1)}\`, logically clustered.

`
  shell.exec(`mkdir -p ${destination}`, { async: true }, async () => {
    fs.appendFileSync(`${destination}/overview.mdx`, overviewPage, 'utf8')
  })
}

const getDescrptionCallouts = (description: string): string =>
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
    .replace(
      '⚠️ IMPORTANT: Since a guard has full power to block Safe transaction execution, a broken guard can cause a denial of service for the Safe. Make sure to carefully audit the guard code and design recovery mechanisms.',
      '<ModuleCallout />'
    )
    .replace(
      'Function is virtual to allow overriding for L2 singleton to emit an event for indexing.',
      '<VirtualCallout />'
    )
    .replace(
      'This can be used with a pre-approved hash transaction signature.',
      '<PreApprovedCallout />'
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
  repoDestination: string
}): string => {
  const isModule = version.includes('/')
  let moduleName = version.split('/')[0]
  if (moduleName === 'allowance') moduleName = 'allowances'
  return `import { Tabs, Callout } from 'nextra/components'
${functionEvents?.map(event => `import ${event} from '../events/${event}.mdx'`).join('\n')}
import LegacyCallout from '${isModule ? '../..' : '..'}/../../../components/callouts/LegacyCallout.mdx'
import OnlySafeTxCallout from '${isModule ? '../..' : '..'}/../../../components/callouts/OnlySafeTxCallout.mdx'
import ReentrancyCallout from '${isModule ? '../..' : '..'}/../../../components/callouts/ReentrancyCallout.mdx'
import IrreversibilityCallout from '${isModule ? '../..' : '..'}/../../../components/callouts/IrreversibilityCallout.mdx'
import VirtualCallout from '${isModule ? '../..' : '..'}/../../../components/callouts/VirtualCallout.mdx'
import ModuleCallout from '${isModule ? '../..' : '..'}/../../../components/callouts/ModuleCallout.mdx'
import PreApprovedCallout from '${isModule ? '../..' : '..'}/../../../components/callouts/PreApprovedCallout.mdx'


${!isModule && version !== 'v1.4.1' ? `<LegacyCallout />` : ''}

# \`${functionName}\` ${functionSignature ?? ''}

${getDescrptionCallouts(functionDescription)}

Defined in [\`${contractName.trim()}.sol\`](${repoUrl}tree/${version}/${contractPath.replace(repoDestination, `${isModule ? 'modules/' + moduleName + '/' : ''}contracts`)}#L${findLinesInFile(contractPath.replace(repoDestination, repoDestination + '/contracts'), 'function ' + functionName)[0] ?? findLinesInFile(contractPath.replace(repoDestination, repoDestination + '/contracts'), functionName ?? '')[0]}).\n

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

  ${description.replaceAll('>', '\\>').replaceAll('<', '\\<')}

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
}

// Recursively process all versions to ensure operations (cloning, installing deps, etc.) are done sequentially:
export const processAllVersions = ({
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
    callback: () => void,
    repoDestination: string,
    mdDestination: string
  ) => void
}): void => {
  if (list.length === 0) {
    // Clean up temporary files
    shell.rm('-rf', repoDestination)
    return // End of processing
  }
  generateFunction(
    list[0],
    () => {
      generateMetaJson(mdDestination, versions, () => {
        processAllVersions({
          list: list.slice(1, list.length),
          mdDestination,
          repoDestination,
          versions,
          generateFunction
        })
      })
    },
    repoDestination,
    mdDestination
  )
}

// Takes a GitHub repository with Solidity contracts and generates documentation for each public function and event
export const runSolidityGenerationScript = (
  mdDestination: string,
  repoDestination: string,
  repoUrl: string,
  versions: string[],
  generateFunction: (
    version: string,
    callback: () => void,
    repoDestination: string,
    mdDestination: string
  ) => void
): void => {
  // Prepare files
  shell.rm('-rf', mdDestination)
  shell.exec(`git clone ${repoUrl} ${repoDestination}`, { async: true }, () => {
    processAllVersions({
      list: versions,
      mdDestination,
      repoDestination,
      versions,
      generateFunction
    })
  })
}
