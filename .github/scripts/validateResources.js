const fs = require('fs')

const resourcesPath = './components/ResourceHub/company-resources.json'
const communityResourcesPath =
  './components/ResourceHub/community-resources.json'

const validateResource = (resource, index, resources) => {
  const errorMessage = 'community-resources.json:1:1:'
  if (resources.findIndex(r => r.url === resource.url) !== index) {
    console.log(errorMessage + `Duplicate resource: ${resource.url}`)
    return false
  }
  if (!resource.name) {
    console.log(errorMessage + `Resource name is missing: ${resource.url}`)
    return false
  }
  if (!resource.type) {
    console.log(errorMessage + `Resource type is missing: ${resource.url}`)
    return false
  }
  if (!resource.date) {
    console.log(errorMessage + `Resource date is missing: ${resource.url}`)
    return false
  }
  if (!resource.description) {
    console.log(errorMessage + `Resource description is missing: ${resource.url}`)
    return false
  }
  if (!resource.tags || !resource.tags.length) {
    console.log(errorMessage + `Resource tags are missing: ${resource.url}`)
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
