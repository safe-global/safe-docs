const fs = require('fs')
const { capitalize } = require('lodash')
const YAML = require('yaml')

const pathsMetadata = require('../../components/ApiReference/paths-metadata.json')
const txServiceNetworks = require('../../components/ApiReference/tx-service-networks.json')

const curlify = (req: any) =>
  `curl -X ${req.method} https://safe-transaction-${req.networkName}.safe.global/api${
    req.url
  } \\
    -H "Accept: application/json" \\
    -H "content-type: application/json" \\
    ${!req.body ? '' : `-d '${JSON.stringify(req.body, null, 2)}'`}`

const sampleSafe = '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
const sampleSafe2 = '0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75'
const sampleSafeWithSafeOp = '0xF72b6C739E7889b89C888403a960a59935564405'
const sampleTargetSafe = '0xb531870897EB944799239FA5485792bA495a7411'
const sampleSafeWithUserOp = '0xFc434a578F935205F459768d8756C000419c6007'
const sampleContract = '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
const sampleMessageHash = '0x3b3b57b3'
const sampleSafeOperationHash =
  '0x597ba36c626a32a4fcc9f23a4b25605ee30b46584918d6b6442387161dc3c51b'
const sampleUserOperationHash =
  '0xe6dac94a3cdbab8d807dfbe79ec378713403ff60cb1a1fff09696813d2705b8e'
const sampleMessage = '0x1234'
const sampleModuleTransactionId = '0x3b3b57b3'
const sampleSafeTxHash =
  '0xa059b4571d8e6cf551eea796f9d86a414083bdc3d5d5be88486589a7b6214be2'
const sampleUuid = '3b3b57b3'
const sampleDelegator = '0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2'
const sampleDelegateAddress = '0xe8A11B18DA0C02ce6304347D8E0DA66C50dEf739'
const sampleOperation = 0
const sampleValue = '0'
const sampleEOA = '0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2'
const sampleAddDelegateSignature =
  '0xabd010065bc8f5c48ebe7eca0e3c9016c2378826b779f0d51aa804808a68fceb1da9785004df85cd1945b1fba47ca181bdb13bff7b71f9ebd460a94a0830f2141b'
const sampleTransferId = '3b3b57b3'
const sampleLabel = '3b3b57b3'
const sampleSafeAppId = 1
const sampleData =
  '0x8d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004f6006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d0000000000000000000000000000000000000000000c685fa11e01ec80000000001111111254fb6c44bac0bed2854e76f90643097d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004087c025200000000000000000000000000f2f400c138f9fb900576263af0bc7fcde2b1b8a8000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001800000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000f2f400c138f9fb900576263af0bc7fcde2b1b8a80000000000000000000000004f3a120e72c76c22ae802d129f599bfdbc31cb810000000000000000000000000000000000000000000c685fa11e01ec8000000000000000000000000000000000000000000000000000000000000da41c43c100000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001408000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064eb5625d90000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000089b78cfa322f6c5de0abceecab66aee45393cc5a0000000000000000000000000000000000000000000c685fa11e01ec800000000000000000000000000000000000000000000000000000000000000080000000000000000000000089b78cfa322f6c5de0abceecab66aee45393cc5a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000448d7ef9bb0000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d00000000000000000000000000000000000000000000000000000da475abf0000000000000000000000000000000000000000000000000000000000065575cda00000000000000000000'
const sampleSignature =
  '0xae31da115daa589fa3cee016c756d191d4140fc0eb30c1565cdddcad35068300669abda9c56e1c5886d72c599e1af29fc70eedd16be72109aa593699661482121c'
const initCode =
  '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec671688f0b900000000000000000000000029fcb43b46531bca003ddc8fcb67ffe91900c7620000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000a97000000000000000000000000000000000000000000000000000000000000001e4b63e800d000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000010000000000000000000000008ecd4ec46d4d2a6b64fe960b3d64e8b94b2234eb0000000000000000000000000000000000000000000000000000000000000140000000000000000000000000a581c4a4db7175302464ff3c06380bc3270b40370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000c6b82ba149cfa113f8f48d5e3b1f78e933e16dfd00000000000000000000000000000000000000000000000000000000000000648d0dc49f00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a581c4a4db7175302464ff3c06380bc3270b40370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
const callData =
  '0x7bb3742800000000000000000000000038869bf66a61cf6bdb996a6ae40d5853fd43b52600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000002c48d80ff0a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000264001c7d4b196cb0c7b01d743fbc6116a902379c723800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000b531870897eb944799239fa5485792ba495a741100000000000000000000000000000000000000000000000000000000000186a0001c7d4b196cb0c7b01d743fbc6116a902379c723800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000b531870897eb944799239fa5485792ba495a741100000000000000000000000000000000000000000000000000000000000186a0001c7d4b196cb0c7b01d743fbc6116a902379c723800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000b531870897eb944799239fa5485792ba495a741100000000000000000000000000000000000000000000000000000000000186a0001c7d4b196cb0c7b01d743fbc6116a902379c723800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000b531870897eb944799239fa5485792ba495a741100000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
const callGasLimit = 140240
const verificationGasLimit = 542895
const preVerificationGas = 66374
const maxFeePerGas = 51026511147
const maxPriorityFeePerGas = 1380000000
const paymasterAndData =
  '0xDFF7FA1077Bce740a6a212b3995990682c0Ba66d000000000000000000000000000000000000000000000000000000006633b1a7000000000000000000000000000000000000000000000000000000000000000066a61c76c14b64bbe67a7c45c5bdc30c890bfde5b9cb66bfdca69d404f9aeb7a0e9a6e6391030f9cce5e64cab2e1f733c63c5a6c88867bde4bbd01be03cf6fa41b'
const signature =
  '0x0bf06e2de4850291c2ae290ea44bc6f4e47da7c0dbfa0ceea60a04ce333435ca4d44f3124c9f34cbd5b4660d09f98ee34dd71c63bb0ccc4392072acbc4f9e52b1c'
const entryPoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
const validAfter = '2024-02-23T04:40:36.000Z'
const validUntil = '2024-07-11T02:00:36.000Z'
const moduleAddress = '0xa581c4A4DB7175302464fF3C06380BC3270b4037'

const getSampleValue = (param: string) => {
  switch (param) {
    case 'nonce':
      return 10
    case 'safe':
      return sampleSafe
    case 'address':
      return sampleSafe2
    case 'to':
      return sampleEOA
    case 'contract':
      return sampleContract
    case 'data':
      return sampleData
    case 'signature':
      return sampleSignature
    case 'message':
      return sampleMessage
    case 'message_hash':
      return sampleMessageHash
    case 'module_transaction_id':
      return sampleModuleTransactionId
    case 'safe_tx_hash':
      return sampleSafeTxHash
    case 'safe_operation_hash':
      return sampleSafeOperationHash
    case 'user_operation_hash':
      return sampleUserOperationHash
    case 'safeAppId':
      return sampleSafeAppId
    case 'uuid':
      return sampleUuid
    case 'delegator':
      return sampleDelegator
    case 'delegate':
    case 'delegate_address':
      return sampleDelegateAddress
    case 'transfer_id':
      return sampleTransferId
    case 'label':
      return sampleLabel
    case 'value':
      return sampleValue
    case 'operation':
      return sampleOperation
    case 'initCode':
      return initCode
    case 'callData':
      return callData
    case 'callGasLimit':
      return callGasLimit
    case 'verificationGasLimit':
      return verificationGasLimit
    case 'preVerificationGas':
      return preVerificationGas
    case 'maxFeePerGas':
      return maxFeePerGas
    case 'maxPriorityFeePerGas':
      return maxPriorityFeePerGas
    case 'paymasterAndData':
      return paymasterAndData
    case 'signature':
      return signature
    case 'entryPoint':
      return entryPoint
    case 'validAfter':
      return validAfter
    case 'validUntil':
      return validUntil
    case 'moduleAddress':
      return moduleAddress
    case 'sender':
    case 'origin':
      return sampleEOA
    default:
      return ''
  }
}

const generateSampleApiResponse = async (
  path: string,
  pathWithParams: string,
  method: string,
  requestBody: string,
  networkName: string
) => {
  const fetch = await import('node-fetch')

  let response: any
  const baseUrl = `https://safe-transaction-${networkName}.safe.global`
  const url = baseUrl + pathWithParams
  if (method === 'get') {
    response = await fetch.default(url).then(async res => {
      if (res.status === 200) return await res?.json()
      else {
        console.error(
          'Error generating response for',
          method,
          path,
          ':',
          await res.text()
        )
      }
    })
  } else if (method === 'post') {
    response = await fetch
      .default(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      .then(async res => {
        if (res.status === 200) return await res?.json()
        else {
          console.error(
            'Error generating response for',
            method,
            path,
            ':',
            await res.text()
          )
        }
      })
  } else if (method === 'delete') response = 'Deleted'
  if (response != null) {
    if (Array.isArray(response)) response = response.slice(0, 2)
    if (response.results)
      response = { ...response, results: response.results.slice(0, 2) }
    fs.writeFileSync(
      `./components/ApiReference/examples/${slugify(path)}-${method}.json`,
      JSON.stringify(response, null, 2)
    )
  }
}

const slugify = (text: string) => text?.replace?.(/ /g, '-').replace(/\//g, '-')
const resolveRef = (swagger: any, ref: string) => {
  const refName = ref.split('/').pop()
  return { refName, ...swagger.components.schemas[refName as string] }
}

const resolveRefs = (swagger: any, obj: any) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (key === '$ref') {
        obj = resolveRef(swagger, obj[key])
      } else {
        obj[key] = resolveRefs(swagger, obj[key])
      }
    }
  }
  return obj
}

const addMethodContext = (json: any) => ({
  ...json,
  paths: Object.entries(json.paths).reduce((acc, [path, methods]) => {
    const newMethods = Object.entries(methods as any).reduce(
      (acc, [method, data]: [any, any]) => ({
        ...acc,
        [method]: {
          ...data,
          path,
          title: pathsMetadata[path]?.[method]?.title ?? '',
          additionalInfo: pathsMetadata[path]?.[method]?.additionalInfo ?? ''
        }
      }),
      {}
    )

    return {
      ...acc,
      [path]: newMethods
    }
  }, {})
})

const getApiJson = async (url: string, networkName: string) => {
  const response = await fetch(url + '/schema/')
  const yaml = await response.text()
  const json = YAML.parse(yaml)
  const withContext = addMethodContext(json)
  fs.writeFileSync(
    `./components/ApiReference/schemas/${networkName}-swagger.json`,
    JSON.stringify(withContext, null, 2)
  )
  return withContext
}

const generateMethodContent = (
  swagger: any,
  networkName: string,
  path: string,
  method: string
) => {
  const _method = swagger.paths[path][method]
  const responses = Object.entries(_method.responses).map(
    ([code, { schema, ...data }]: [any, any]) => ({
      code,
      schema:
        schema?.['$ref'] !== undefined
          ? resolveRef(swagger, schema['$ref'])
          : {
              ...schema,
              items:
                schema?.items?.['$ref'] !== undefined
                  ? resolveRef(swagger, schema.items['$ref'])
                  : schema?.items
            },
      ...data
    })
  )
  const pathParams = path.match(/{[^}]*}/g)
  const pathWithParams =
    pathParams?.reduce(
      (acc, param) =>
        acc.replace(param, getSampleValue(param.replace(/{|}/g, '')) as string),
      path
    ) ?? path

  const title =
    pathsMetadata[path]?.[method]?.title ??
    path.replace(/{/g, '\\{').replace(/}/g, '\\}') +
      ' - ' +
      method.toUpperCase()
  const filePath = `./components/ApiReference/examples/${slugify(
    path
  )}-${method}`.replace('-api', '')
  const examplePath =
    filePath.replace('examples', `examples/${networkName}`) + '.ts'
  const sampleResponsePath = filePath + '.json'
  const hasExample = fs.existsSync(examplePath)
  const hasResponse = fs.existsSync(sampleResponsePath)
  let example, sampleResponse, requestBody
  if (hasExample) example = fs.readFileSync(examplePath, 'utf-8')
  if (hasResponse) sampleResponse = fs.readFileSync(sampleResponsePath, 'utf-8')
  requestBody =
    method === 'get'
      ? undefined
      : _method.parameters
          ?.filter((p: any) => p.in === 'body')
          .map((p: any) => p.schema?.properties)
          .reduce((acc: any, obj: any) => {
            for (const key in obj) {
              acc[key] = getSampleValue(key)
            }
            return acc
          }, {})

  // const query =
  //   '?limit=2' +
  //   (_method.parameters.map(p => p.name).includes('safe')
  //     ? `&safe=${sampleSafe}`
  //     : '')

  // This is commented out, as we omit response generation for now.
  // It is planned to move this into a separate script.
  // generateSampleApiResponse(path, pathWithParams + query, method, requestBody, networkName)

  const codeBlockWithinDescription = _method.description?.match(
    /```[a-z]*\n[\s\S]*?\n```/
  )?.[0]
  const description = _method.description
    ?.replace(codeBlockWithinDescription, '___insert code block___')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/(?<=\n)-/g, '\n\\-')
    .replace('___insert code block___', codeBlockWithinDescription)

  return `### ${title}

<Grid container justifyContent='space-between'>
  <Grid item xs={12} md={5.6}>

    ${_method.summary ?? ''}

    ${description}

    ${_method.additionalInfo ?? ''}

    <Parameters parameters={${JSON.stringify(_method.parameters ?? [])}} />
    <Responses responses={${JSON.stringify(responses)}} />
    <Feedback asPath={"/core-api/transaction-service-reference#${slugify(
      title
    )}"} label='Did this API route run successfully?' small />
  </Grid>
  <Grid item xs={12} md={5.6}>
    <Path path="${path}" method="${method}" />

    <SampleRequestHeader method="${method}" pathWithParams="${pathWithParams}" />

    <CH.Section>
      <CH.Code style={{boxShadow: 'none'}}>
${
  hasExample && example !== 'export {}\n'
    ? `
\`\`\`js TypeScript
// from ${examplePath.replace('./components/ApiReference/', '../')}
\`\`\`
            `
    : ''
}
\`\`\`bash ${hasExample && example !== 'export {}\n' ? 'curl' : ''}
${curlify({
  url: pathWithParams,
  method: method.toUpperCase(),
  body: requestBody,
  networkName
})} 
\`\`\`
      </CH.Code>
    </CH.Section>

    ${
      hasResponse && sampleResponse !== '{}'
        ? `#### Sample Response

\`\`\`json
${sampleResponse}
\`\`\``
        : ''
    }
  </Grid>
</Grid>
<Hr style={{ 
  marginTop: '112px',
  marginBottom: '112px'
}} />
`
}

const generatePathContent = (swagger: any, networkName: string, path: string) =>
  `${Object.keys(swagger.paths[path])
    .filter(method => method !== 'parameters')
    .map(method => generateMethodContent(swagger, networkName, path, method))
    .join('\n')}`

const generateCategoryContent = (
  swagger: any,
  networkName: string,
  category: {
    title: string
    paths: string[]
  }
) => `<Grid my={8} />

## ${capitalize(category.title)}

<Grid my={6} />

${category.paths.map(path => generatePathContent(swagger, networkName, path)).join('\n')}`

const getCategories = (swagger: any) => {
  const allMethods: any = Object.entries(swagger.paths)
    .map(([k, v]: [any, any]) => Object.values(v))
    .flat()
  const allCategories = Array.from(
    new Set(
      allMethods
        .map((method: { tags: string[] }) => method.tags)
        .flat()
        .filter(Boolean)
    )
  ) as string[]
  return allCategories.map((title: string) => ({
    title,
    paths: allMethods
      .filter(
        (method: { tags: string[]; deprecated: boolean }) =>
          method.tags?.includes(title) && !method.deprecated
      )
      .map((m: { path: string }) => m.path)
      .filter((path: string, i: number, arr: any[]) => arr.indexOf(path) === i)
  }))
}

const generateMainContent = (swagger: any, networkName: string) => {
  const categories = getCategories(swagger).filter(
    c => c.title !== 'about' && c.title !== 'notifications'
  )
  return `import Path from '../Path'
import Hr from '../../Hr'
import SampleRequestHeader from '../SampleRequestHeader'
import Parameters from '../Parameter'
import NetworkSwitcher from '../Network'
import Responses from '../Response'
import Feedback from '../../Feedback'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import NextLink from 'next/link'
import Link from '@mui/material/Link'

# Safe Transaction Service API Reference

The Safe Transaction Service API Reference is a collection of endpoints that allow to keep track of Safe transactions.

This service is available on [multiple networks](../../../core-api/transaction-service-supported-networks), at different endpoints.

<NetworkSwitcher />

${categories.map(category => generateCategoryContent(swagger, networkName, category)).join('\n')}
`
}

const main = async () => {
  txServiceNetworks.forEach(
    async (network: { chainId: string; txServiceUrl: string }) => {
      const networkName = network.txServiceUrl
        .replace('https://safe-transaction-', '')
        .split('.')[0]
      // Download swagger schema and converts it from YAML to JSON.
      const jsonFile = await getApiJson(network.txServiceUrl, networkName)
      const resolvedJson = resolveRefs(jsonFile, jsonFile)

      // Generate the page which will load the reference file, and parse it to generate the dynamic sidebar on the client side.
      fs.writeFileSync(
        `./pages/core-api/transaction-service-reference/${networkName}.mdx`,
        `
{/* <!-- vale off --> */}
import ApiReference from '../../../components/ApiReference'
import { renderToString } from 'react-dom/server'
import { MDXComponents, getHeadingsFromHtml } from '../../../lib/mdx'
import Mdx from '../../../components/ApiReference/generated/${networkName}-reference.mdx'
import swagger from '../../../components/ApiReference/schemas/${networkName}-swagger.json'

export const getStaticProps = async () => {
  const renderedMdx = <Mdx components={MDXComponents} />
  const contentString = renderToString(renderedMdx)
  const headings = getHeadingsFromHtml(swagger, contentString)

  return {
    props: {
      ssg: { headings }
    }
  }
}

<ApiReference networkName="${networkName}"/>
{/* <!-- vale on --> */}
`
      )

      // Generate the main reference file.
      const mdxContent = generateMainContent(resolvedJson, networkName)
      fs.writeFileSync(
        `./components/ApiReference/generated/${networkName}-reference.mdx`,
        mdxContent
      )

      // Replace Sepolia chainId in the example files.
      const exampleFiles = fs
        .readdirSync('./components/ApiReference/examples/sepolia')
        .filter((file: string) => file.endsWith('.ts'))
      exampleFiles.forEach((file: string) => {
        const contents = fs.readFileSync(
          `./components/ApiReference/examples/sepolia/${file}`,
          'utf-8'
        )
        if (
          !fs.existsSync(`./components/ApiReference/examples/${networkName}`)
        ) {
          fs.mkdirSync(`./components/ApiReference/examples/${networkName}`)
        }
        fs.writeFileSync(
          `./components/ApiReference/examples/${networkName}/${file}`,
          contents.replace('chainId: 11155111n', `chainId: ${network.chainId}n`)
        )
      })
    }
  )
}

main()
