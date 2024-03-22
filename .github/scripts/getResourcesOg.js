const ogs = require('open-graph-scraper')
const fs = require('fs')

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
    resources.map(async resource => {
      const og = await getResourceOg(resource.url)
      return {
        name: resource.name ?? og.ogTitle,
        url: resource.url,
        type: resource.type,
        date: resource.date,
        description: resource.description ?? og.ogDescription,
        tags: resource.tags,
        image: og.ogImage[0]?.url
      }
    })
  )

  const updatedCommunityResources = await Promise.all(
    communityResources.map(async resource => {
      const og = await getResourceOg(resource.url)
      return {
        name: resource.name ?? og.ogTitle,
        url: resource.url,
        type: resource.type,
        date: resource.date,
        description: resource.description ?? og.ogDescription,
        tags: resource.tags,
        ...(!(parseInt(og.ogImage[0].height) < 60) && {
          image: og.ogImage[0].url
        })
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
