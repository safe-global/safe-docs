import { useState, useCallback, useMemo, useEffect } from 'react'
import throttle from 'lodash/throttle'

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

export const useCurrentTocIndex: (
  headings: Heading[],
  navHeight: number
) => string = (headings, navHeight) => {
  const [currentIndex, setCurrentIndex] = useState('')
  const delay = 166

  const findActiveIndex = useCallback(() => {
    let active
    const _headings = [
      ...headings,
      ...headings.flatMap(heading => heading.children)
    ]

    for (let i = _headings.length - 1; i >= 0; i -= 1) {
      const item = _headings[i]
      const node = document.getElementById(item?.link?.slice(1) ?? '')

      if (
        node != null &&
        node.offsetTop - navHeight <
          document.documentElement.scrollTop + node.clientHeight
      ) {
        active = item
        break
      }
    }
    if (active != null) {
      const nextHeading = _headings[_headings.indexOf(active) + 1]
      const nextHeadingNode = document.getElementById(
        nextHeading?.link.slice(1) ?? ''
      )
      const isNextHeadingInView =
        nextHeadingNode != null &&
        nextHeadingNode.offsetTop - navHeight <
          document.documentElement.scrollTop + window.innerHeight
      setCurrentIndex(
        isNextHeadingInView ? (nextHeading?.link ?? '') : (active?.link ?? '')
      )
    } else setCurrentIndex(_headings[0]?.children?.[0]?.link ?? '')
  }, [headings, navHeight])

  const scrollListener = useMemo(
    () => throttle(findActiveIndex, delay),
    [findActiveIndex, delay]
  )

  useEffect(() => {
    const shiftWindow: () => void = () => {
      scrollBy(0, -navHeight)
    }
    if (window.location.hash != null) shiftWindow()
    window.addEventListener('scroll', scrollListener)
    window.addEventListener('hashchange', shiftWindow)
    return () => {
      window.removeEventListener('scroll', scrollListener)
      window.removeEventListener('hashchange', shiftWindow)
    }
  }, [navHeight, scrollListener])

  return currentIndex
}
