import { type Heading } from '../components/ApiReference/TOC'
import pathsMetadata from '../components/ApiReference/paths-metadata.json'
import type Swagger from '../components/ApiReference/mainnet-swagger.json'

export const slugify: (text: string) => string = text =>
  text?.replace?.(/ /g, '-').replace(/\//g, '-')

export const sanitizeMdx = (mdxString: string): string =>
  mdxString?.replaceAll('{', '\\{').replaceAll('}', '\\}')

export const getHeadingChildren = (
  swagger: typeof Swagger,
  heading: string
): Heading[] => {
  const allMethods = Object.entries(swagger.paths)
    .map(([k, v]) => Object.entries(v))
    .flat()

  return allMethods
    .filter(
      ([, method]) =>
        method.deprecated !== true &&
        method.tags?.[0]?.toLowerCase() === heading
    )
    .map(([methodName, method]) => {
      const title =
        pathsMetadata?.[method.path as '/api/v1/about/ethereum-rpc/']?.[
          methodName as 'get'
        ]?.title ?? method.path + ' - ' + methodName?.toUpperCase()
      return {
        text: title,
        link: `#${slugify(title)}`,
        method: methodName
      }
    })
    .filter(child => !child.text.includes('Deprecated'))
}

export const getHeadingsFromHtml = (
  swagger: typeof Swagger,
  stringifiedHtml: string
): Heading[] => {
  const headings = stringifiedHtml.match(/<h[2]\s[^>]*>(.*?)<\/h[2]>/g)
  if (headings != null) {
    return (
      headings?.map(heading => {
        const headingText = heading
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .split('.')[0]
          .trim()
        let link = `#${slugify(headingText)}`
        if (link.slice(-1) === '-') link = link.slice(0, -1)
        return {
          text: headingText,
          link,
          children: getHeadingChildren(swagger, headingText.toLowerCase())
        }
      }) ?? []
    )
  }
  return []
}
