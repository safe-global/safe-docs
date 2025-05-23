const fs = require('fs')

const resourcesPath = './components/ResourceHub/company-resources.json'
const communityResourcesPath =
  './components/ResourceHub/community-resources.json'

const validateResource = (resource, index, resources) => {
  if (resources.findIndex(r => r.url === resource.url) !== index) {
    console.log(`${resource.name}: Duplicate resource`)
    return false
  }
  if (!resource.name) {
    console.log(`${resource.name}: Resource name is missing`)
    return false
  }
  if (!resource.type) {
    console.log(`${resource.name}: Resource type is missing`)
    return false
  }
  if (!resource.date) {
    console.log(`${resource.name}: Resource date is missing`)
    return false
  }
  if (!resource.description) {
    console.log(`${resource.name}: Resource description is missing`)
    return false
  }
  if (resource.description.length > 200) {
    console.log(`${resource.name}: Resource description is too long`)
    return false
  }
  if (!resource.tags || !resource.tags.length) {
    console.log(errorMessage + `${resource.name}: Resource tags are missing`)
    return false
  }
  if (
    resource.url.includes('youtube') &&
    (!resource.url.startsWith('https://www.youtube.com/watch?v=') ||
      resource.url.length !== 43)
  ) {
    console.log(`${resource.name}: Invalid YouTube URL`)
    return false
  }
  if (!resource.lastChecked) {
    console.log(`${resource.name}: The last checked property is missing. If adding a new resource, please add today's date`)
    return false
  }
  return true
}

const validateResources = () => {
  const resources = [
    ...JSON.parse(fs.readFileSync(resourcesPath, 'utf8')),
    ...JSON.parse(fs.readFileSync(communityResourcesPath, 'utf8'))
  ]

  if (resources.map(validateResource).some(valid => !valid)) {
    process.exit(1)
  }
}

validateResources()
