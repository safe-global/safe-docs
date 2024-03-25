const fs = require('fs')

const resourcesPath = './components/ResourceHub/company-resources.json'
const communityResourcesPath =
  './components/ResourceHub/community-resources.json'

const validateResource = (resource, index, resources) => {
  if (resources.findIndex(r => r.url === resource.url) !== index) {
    console.log(`Duplicate resource`)
    return false
  }
  if (!resource.name) {
    console.log(`Resource name is missing`)
    return false
  }
  if (!resource.type) {
    console.log(`Resource type is missing`)
    return false
  }
  if (!resource.date) {
    console.log(`Resource date is missing`)
    return false
  }
  if (!resource.description) {
    console.log(`Resource description is missing`)
    return false
  }
  if (resource.description.length > 200) {
    console.log(`Resource description is too long`)
    return false
  }
  if (!resource.tags || !resource.tags.length) {
    console.log(errorMessage + `Resource tags are missing`)
    return false
  }
  if (
    resource.url.includes('youtube') &&
    (!resource.url.startsWith('https://www.youtube.com/watch?v=') ||
      resource.url.length !== 43)
  ) {
    console.log(`Invalid YouTube URL`)
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
