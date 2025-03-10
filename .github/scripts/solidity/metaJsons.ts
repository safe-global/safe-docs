import fs from 'fs'
import shell from 'shelljs'

import { functionCategories } from './constants'
import capitalize from 'lodash/capitalize'
import { DocContent } from './types'

export const generateMetaJson = async (
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
export const generateMetaJsonVersions = (
  version: string,
  destination: string
) => {
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
    ...categories.map(category => [category, capitalize(category)])
  ])
  fs.writeFileSync(
    `${destination}/_meta.json`,
    JSON.stringify(content, null, 2),
    'utf8'
  )
}

// Generate the _meta.json file for each category
export const generateMetaJsonCategories = (
  destination: string,
  publicFunctions: string[]
) => {
  const categories = Object.entries(functionCategories)
  categories.forEach(([category, functions]) => {
    const content = Object.fromEntries(
      functions
        .map(functionName => [functionName, functionName])
        .filter(([functionName]) => publicFunctions.includes(functionName))
    )
    fs.writeFileSync(
      `${destination}/${category}/_meta.json`,
      JSON.stringify(content, null, 2),
      'utf8'
    )
  })
}
