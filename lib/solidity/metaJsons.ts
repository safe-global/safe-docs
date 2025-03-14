import fs from 'fs'
import shell from 'shelljs'
import capitalize from 'lodash/capitalize'

import { modulesCategories, smartAccountCategories } from './constants'

export const generateMetaJson = (
  destination: string,
  categories: string[],
  callback: () => void
): void => {
  const metaJson = Object.fromEntries(
    categories.map(v => {
      const versionNumber = v.split('/')[1]
      const version = versionNumber == null ? v : v.split('/')[0]
      return [
        version,
        {
          title: version,
          type: 'page',
          display: 'hidden'
        }
      ]
    })
  )
  shell.exec(`mkdir -p ${destination}`, { async: true }, async () => {
    fs.writeFileSync(
      `${destination}/_meta.json`,
      JSON.stringify(metaJson, null, 2),
      'utf8'
    )
    callback()
  })
}

// Generate the _meta.json file for each version number of the Safe Smart Account
export const generateMetaJsonVersions = (
  version: string,
  destination: string
): void => {
  const categories = Object.keys(smartAccountCategories)
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
    ...categories.map(category => [category, capitalize(category)])
  ])
  fs.writeFileSync(
    `${destination}/_meta.json`,
    JSON.stringify(content, null, 2),
    'utf8'
  )
}

// Generate the _meta.json file for each version number of the Safe Smart Account
export const generateMetaJsonVersionsModule = (
  version: string,
  destination: string
): void => {
  const moduleName = version.split('/')[0]
  const categories = Object.keys(modulesCategories[moduleName as '4337'])
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
      `-- Safe Module Reference`,
      {
        type: 'separator',
        title: `${capitalize(moduleName)} Module Reference`
      }
    ],
    ['events', { title: 'Events', type: 'page', display: 'hidden' }],
    ...categories.map(category => [category, capitalize(category)])
  ])
  fs.appendFileSync(
    `${destination}/_meta.json`,
    JSON.stringify(content, null, 2),
    'utf8'
  )
}

// Generate the _meta.json file for each category
export const generateMetaJsonCategories = (
  destination: string,
  publicFunctions: string[],
  version: string
): void => {
  const categories = Object.entries(
    version.includes('/')
      ? modulesCategories[version.split('/')[0] as '4337']
      : smartAccountCategories
  )
  categories.forEach(([category, functions]) => {
    const content = Object.fromEntries(
      functions
        .map(functionName => [functionName, functionName])
        .filter(([functionName]) => publicFunctions.includes(functionName))
    )
    fs.mkdirSync(`${destination}/${category}`, { recursive: true })
    fs.writeFileSync(
      `${destination}/${category}/_meta.json`,
      JSON.stringify(content, null, 2),
      'utf8'
    )
  })
}
