const fs = require('fs')
const { capitalize } = require('lodash')

const jsonFile = require('../../components/ApiReference/mainnet-swagger.json')
const pathsMetadata = require('../../components/ApiReference/paths-metadata.json')

const curlify = req =>
  `curl -X ${req.method} https://safe-transaction-mainnet.safe.global/api${
    req.url
  } \\
    -H "Accept: application/json" \\
    -H "content-type: application/json" \\
    ${!req.body ? '' : `-d '${req.body}'`}`

const sampleSafe = '0xB88F61E6FbdA83fbfffAbE364112137480398018'
const sampleContract = '0xB88F61E6FbdA83fbfffAbE364112137480398018'
const sampleMessageHash = '0x3b3b57b3'
const sampleModuleTransactionId = '0x3b3b57b3'
const sampleSafeTxHash = '0x3b3b57b3'
const sampleUuid = '3b3b57b3'
const sampleDelegateAddress = '0x5A93Fe8eBBf78738468c10894D7f36fA247b71C0'
const sampleTransferId = '3b3b57b3'

const getSampleValue = param => {
  switch (param) {
    case '{address}':
      return sampleSafe
    case '{contract}':
      return sampleContract
    case '{message_hash}':
      return sampleMessageHash
    case '{module_transaction_id}':
      return sampleModuleTransactionId
    case '{safe_tx_hash}':
      return sampleSafeTxHash
    case '{uuid}':
      return sampleUuid
    case '{delegate_address}':
      return sampleDelegateAddress
    case '{transfer_id}':
      return sampleTransferId
    default:
      return ''
  }
}

const generateSampleApiResponse = async (path, pathWithParams, method) => {
  const fetch = await import('node-fetch')

  let response
  const url = `https://safe-transaction-mainnet.safe.global/api${pathWithParams}`
  if (method === 'get') {
    response = await fetch.default(url).then(async res => {
      if (res.status === 200) return await res?.json()
      else {
        console.error(
          'Error generating response for',
          path,
          ':',
          res.statusText
        )
        return {}
      }
    })
  } else if (method === 'delete')
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

const slugify = text => text?.replace?.(/ /g, '_').replace(/\//g, '_')
const resolveRef = ref => jsonFile.definitions[ref.split('/').pop()]
const resolveRefs = obj => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (key === '$ref') {
        obj = resolveRef(obj[key])
      } else {
        obj[key] = resolveRefs(obj[key])
      }
    }
  }
  return obj
}

const mainnetApiJson = resolveRefs(jsonFile)

const addMethodContext = json => ({
  ...json,
  paths: Object.entries(json.paths).reduce((acc, [path, methods]) => {
    const newMethods = Object.entries(methods).reduce(
      (acc, [method, data]) => ({
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

const getApiJson = async url => {
  const response = await fetch(url + '/?format=openapi')
  const json = await response.json()
  const withContext = addMethodContext(json)
  fs.writeFileSync(
    './components/ApiReference/mainnet-swagger.json',
    JSON.stringify(withContext, null, 2)
  )
  return withContext
}

const generateMethodContent = (path, method) => {
  const _method = mainnetApiJson.paths[path][method]
  const responses = Object.entries(_method.responses).map(
    ([code, { schema, ...data }]) => ({
      code,
      schema:
        schema?.['$ref'] !== undefined
          ? resolveRef(schema['$ref'])
          : {
              ...schema,
              items:
                schema?.items?.['$ref'] !== undefined
                  ? resolveRef(schema.items['$ref'])
                  : schema?.items
            },
      ...data
    })
  )
  const pathParams = path.match(/{[^}]*}/g)
  const pathWithParams =
    pathParams?.reduce(
      (acc, param) => acc.replace(param, getSampleValue(param)),
      path
    ) ?? path

  const title =
    pathsMetadata[path]?.[method]?.title ??
    path.replace(/{/g, '\\{').replace(/}/g, '\\}') +
      ' - ' +
      method.toUpperCase()
  const filePath = `./components/ApiReference/examples/${slugify(
    path
  )}-${method}`
  const examplePath = filePath + '.ts'
  const sampleResponsePath = filePath + '.json'
  const hasExample = fs.existsSync(examplePath)
  const hasResponse = fs.existsSync(sampleResponsePath)
  let example, sampleResponse
  if (hasExample) example = fs.readFileSync(examplePath, 'utf-8')
  if (hasResponse) sampleResponse = fs.readFileSync(sampleResponsePath, 'utf-8')

  const query =
    '?limit=2' +
    (_method.parameters.map(p => p.name).includes('safe')
      ? `&safe=${sampleSafe}`
      : '')

  generateSampleApiResponse(path, pathWithParams + query, method)

  const codeBlockWithinDescription = _method.description.match(
    /```[a-z]*\n[\s\S]*?\n```/
  )?.[0]
  const description = _method.description
    .replace(codeBlockWithinDescription, '---insert code block---')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace('---insert code block---', codeBlockWithinDescription)

  return `### ${title}

<Grid container justifyContent='space-between'>
  <Grid item xs={12} md={5.6}>

${_method.summary ?? ''}

${description}

${_method.additionalInfo ?? ''}

    <Parameters parameters={${JSON.stringify(_method.parameters ?? [])}} />
    <Responses responses={${JSON.stringify(responses)}} />
    <Feedback asPath={"/api-reference#${slugify(
      title
    )}"} label='Did this API route run successfully?' small />
  </Grid>
  <Grid item xs={12} md={5.6}>
   <Path path="${path}" method="${method}" />
   #### Sample Request
   <CH.Section>
    <CH.Code>
    ${
      hasExample && example !== 'export {}\n'
        ? `
      \`\`\`js query.js
        // from ./examples/${slugify(path)}-${method}.ts
      \`\`\`
    `
        : ''
    }

\`\`\`bash ${hasExample ? 'curl.sh' : ''}
${curlify({ url: pathWithParams, method: method.toUpperCase(), body: '' })}
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
  marginTop: '140px',
  marginBottom: '200px'
}} />
`
}

const generatePathContent = path =>
  `${Object.keys(mainnetApiJson.paths[path])
    .filter(method => method !== 'parameters')
    .map(method => generateMethodContent(path, method))
    .join('\n')}`

const generateCategoryContent = category => {
  return `<Grid my={8} />
## ${capitalize(category.title)}
<Grid my={24} />

  ${category.paths
    .filter(
      path =>
        path !== '/v1/safes/{address}/balances/' &&
        path !== '/v1/safes/{address}/balances/usd/'
    )
    .map(path => generatePathContent(path))
    .join('\n')}`
}

const getCategories = version =>
  Object.keys(mainnetApiJson.paths)
    .filter(path => path.includes(version))
    .map(path => {
      const pathname = path.replace('/' + version + '/', '').slice(0, -1)
      return {
        title: pathname.split('/')[0],
        paths: Object.entries(mainnetApiJson.paths)
          .filter(([key]) => key.includes(path))
          .flat()
          .filter((value, index) => index % 2 === 0)
      }
    })
    .filter(
      (category, index, self) =>
        index === self.findIndex(t => t.title === category.title) &&
        category.title !== ''
    )

const generateMainContent = () => {
  const categories = [...getCategories('v1')].filter(
    c => c.title !== 'about' && c.title !== 'notifications'
  )

  return `
import Path from './Path'
import Hr from '../Hr'
import Parameters from './Parameter'
import NetworkSwitcher from './Network'
import Responses from './Response'
import Feedback from '../Feedback'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import '@code-hike/mdx/dist/index.css'

# Safe Transaction Service API Reference

This is the Safe Transaction Service API Reference. It is a
collection of endpoints that allow you to keep track of
transactions sent via Safe smart contracts.

The Transaction Service is available on [multiple networks](../../advanced/api-supported-networks), at
different endpoints.

<NetworkSwitcher />

  ${categories.map(category => generateCategoryContent(category)).join('\n')}
`
}

const main = async () => {
  await getApiJson('https://safe-transaction-mainnet.safe.global')
  const mdxContent = generateMainContent()
  fs.writeFileSync(
    `./components/ApiReference/generated-reference.mdx`,
    mdxContent
  )
}

main()
