const ogs = require('open-graph-scraper')
const fs = require('fs')
const path = require('path')

const resourcesPath = './components/ResourceHub/company-resources.json'
const communityResourcesPath =
  './components/ResourceHub/community-resources.json'

const getResourceOg = async url => {
  const options = { url, timeout: 10000 }
  const { result } = await ogs(options)
  return result
}

const updateResourceOg = async () => {
  const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  const communityResources = JSON.parse(
    fs.readFileSync(communityResourcesPath, 'utf8')
  )

  const updatedResources = await Promise.all(
    resources
      .filter(r => r.type !== 'video')
      .map(async resource => {
        const og = await getResourceOg(resource.url)
        return {
          ...resource,
          og: {
            title: og.ogTitle,
            description: og.ogDescription,
            image: og.ogImage[0]?.url
          }
        }
      })
  )

  const updatedCommunityResources = await Promise.all(
    communityResources
      .filter(r => r.type !== 'video')
      .map(async resource => {
        const og = await getResourceOg(resource.url)
        return {
          ...resource,
          og: {
            title: og.ogTitle,
            description: og.ogDescription,
            image: og.ogImage[0]?.url
          }
        }
      })
  )

  fs.writeFileSync(resourcesPath, JSON.stringify(updatedResources, null, 2))
  fs.writeFileSync(
    communityResourcesPath,
    JSON.stringify(updatedCommunityResources, null, 2)
  )
}

updateResourceOg()
