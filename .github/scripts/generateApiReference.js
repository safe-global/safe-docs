const fs = require('fs')
const { capitalize } = require('lodash')

const mainnetApiJson = require('../../components/ApiReference/mainnet-swagger.json')
const pathsMetadata = require('../../components/ApiReference/paths-metadata.json')

const transactionServiceUrls = [
  'https://safe-transaction-mainnet.safe.global',
  'https://safe-transaction-arbitrum.safe.global',
  'https://safe-transaction-aurora.safe.global',
  'https://safe-transaction-avalanche.safe.global',
  'https://safe-transaction-base.safe.global',
  'https://safe-transaction-base-sepolia.safe.global',
  'https://safe-transaction-bsc.safe.global',
  'https://safe-transaction-celo.safe.global',
  'https://safe-transaction-gnosis-chain.safe.global',
  'https://safe-transaction-optimism.safe.global',
  'https://safe-transaction-polygon.safe.global',
  'https://safe-transaction-zkevm.safe.global',
  'https://safe-transaction-sepolia.safe.global',
  'https://safe-transaction-zksync.safe.global'
]

const addMethodContext = json => ({
  ...json,
  paths: Object.entries(json.paths).reduce((acc, [path, methods]) => {
    const newMethods = Object.entries(methods).reduce(
      (acc, [method, data]) => ({
        ...acc,
        [method]: {
          ...data,
          path,
          title: pathsMetadata[path]?.title ?? '',
          additionalInfo: pathsMetadata[path]?.additionalInfo ?? ''
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

const generateResponseContent = (response, path, method) =>
  `**${response}** - ${mainnetApiJson.paths[path][method].responses[response].description}`

const generateParameterContent = parameter =>
  `**${parameter.name}** - ${
    parameter.name === '200' ? 'OK' : parameter.description
  }`

const generateMethodContent = (path, method) => {
  const _method = mainnetApiJson.paths[path][method]
  const responses = Object.keys(_method.responses)
  return `### ${path}
  <Method method="${method}" /> 
  
${_method.summary ?? ''}

${_method.description ?? ''}

${
  _method.parameters?.length > 0
    ? `##### Parameters
${_method.parameters
  ?.map(parameter => generateParameterContent(parameter))
  .join('\n')}`
    : ''
}

${
  responses.length > 0
    ? `##### Responses

${responses
  .map(response => generateResponseContent(response, path, method))
  .join('\n')}
`
    : ''
}`
}

const generatePathContent = path =>
  `${Object.keys(mainnetApiJson.paths[path])
    .filter(method => method !== 'parameters')
    .map(method => generateMethodContent(path, method))
    .join('\n')}`

const generateCategoryContent = category => {
  return `## ${capitalize(category.title)}

  ${category.paths.map(path => generatePathContent(path)).join('\n')}`
}

const getCategories = version =>
  Object.keys(mainnetApiJson.paths)
    .filter(path => path.includes(version))
    .map(path => {
      const pathname = path.replace('/' + version + '/', '').slice(0, -1)
      return {
        title: pathname.split('/')[0],
        paths: Object.entries(mainnetApiJson.paths)
          .filter(([key]) => key.includes(pathname))
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
  const categories = [...getCategories('v1'), ...getCategories('v2')]

  return `
import Method from './Method'

# Safe Transaction Service API Reference  

  ${mainnetApiJson.info?.description}
    
  ${categories.map(path => generateCategoryContent(path)).join('\n')}
  `
}

const main = async () => {
  await getApiJson(transactionServiceUrls[0])
  const mdxContent = generateMainContent()
  fs.writeFileSync(
    `./components/ApiReference/generated-reference.mdx`,
    mdxContent.replace(/{/g, '\\{').replace(/}/g, '\\}')
  )
}

main()
