import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode
} from 'react'
import Link from 'next/link'
import throttle from 'lodash/throttle'
import { type SxProps } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {
  CopyToClipboard,
  Code,
  Pre,
  Td,
  Table,
  Th,
  Tr
} from 'nextra/components'
import MuiLink from '@mui/material/Link'

import { type Heading } from '../components/ApiReference/TOC'
import swagger from '../components/ApiReference/mainnet-swagger.json'
import pathsMetadata from '../components/ApiReference/paths-metadata.json'

export const slugify: (text: string) => string = text =>
  text?.replace?.(/ /g, '_').replace(/\//g, '_')

export const getHeadingChildren: (heading: string) => Heading[] = heading => {
  const headingPath = '/v1/' + heading + '/'
  const children = Object.keys(swagger.paths)
    .filter(path => path.startsWith(headingPath))
    .map(path => {
      const method = Object.keys(swagger.paths[path as '/v1/about/'])[0]
      const title =
        pathsMetadata?.[path as '/v1/about/ethereum-rpc/']?.[method as 'get']
          ?.title ?? path + ' - ' + method.toUpperCase()
      return {
        text: title,
        link: `#${slugify(title)}`,
        method
      }
    })
  return children
}

export const getHeadingsFromHtml: (
  stringifiedHtml: string
) => Heading[] = stringifiedHtml => {
  const regex = /<h[2]\s[^>]*>(.*?)<\/h[2]>/g
  if (stringifiedHtml.match(regex) != null) {
    return (
      stringifiedHtml.match(regex)?.map(heading => {
        const headingText = heading
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim()
        const link = `#${slugify(headingText)}`
        return {
          text: headingText,
          link,
          children: getHeadingChildren(headingText.toLowerCase())
        }
      }) ?? []
    )
  }
  return []
}

const getMarkdownHeaderComponent: (
  headingLevel: number
) => React.FC<{ children: ReactNode }> =
  headingLevel =>
    ({ children }) => {
      const HeadingComponent: React.FC = () => (
      <Typography
        variant={`h${headingLevel}` as 'h1'}
        textTransform='none'
        id={slugify(children as string)}
      >
        {children as string}
      </Typography>
      )
      return HeadingComponent({})
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
        isNextHeadingInView ? nextHeading?.link ?? '' : active?.link ?? ''
      )
    }
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

export const CustomLink: React.FC<{
  href: string
  sx?: SxProps
  children: ReactNode
  target: string
}> = ({ children, href, sx, ...props }) => (
  <Link href={href} shallow={false}>
    <MuiLink
      component='span'
      sx={{ ':hover': { cursor: 'pointer' }, ...sx }}
      {...props}
    >
      {children as string}
    </MuiLink>
  </Link>
)

export const CustomParagraph: React.FC<{
  children: ReactNode
  isLi?: boolean
}> = ({ children, isLi }) => (
  <span>
    {isLi !== true && <br />}
    {Array.isArray(children) ? children?.map((child, i) => child) : children}
    {isLi !== true && <br />}
  </span>
)

export const CustomLi: React.FC<{
  children: ReactNode
}> = ({ children }) => (
  <li>
    <CustomParagraph isLi>{children}</CustomParagraph>
  </li>
)

export const CustomUl: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ul
    style={{
      marginBlockStart: '4px',
      marginBlockEnd: '8px'
    }}
  >
    {children}
  </ul>
)

export const CustomCode: React.FC<{
  children: ReactNode
}> = ({ children }) => (
  <Typography
    variant='body1'
    component='code'
    sx={{
      backgroundColor: 'grey.light4',
      padding: '0.2rem',
      borderRadius: '4px',
      fontFamily: 'monospace',
      lineHeight: 2,
      border: ({ palette }) => `1px solid ${palette.grey[300]}`
    }}
  >
    {children}
  </Typography>
)

export const MDXComponents = {
  p: CustomParagraph,
  li: CustomLi,
  ul: CustomUl,
  a: CustomLink,
  code: Code,
  h1: getMarkdownHeaderComponent(1),
  h2: getMarkdownHeaderComponent(2),
  h3: getMarkdownHeaderComponent(3),
  h4: getMarkdownHeaderComponent(4),
  h5: getMarkdownHeaderComponent(5),
  h6: getMarkdownHeaderComponent(6),
  table: Table,
  thead: Th,
  tr: Tr,
  td: Td,
  pre: Pre,
  CopyToClipboard
}
