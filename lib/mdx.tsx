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
import Button from '@mui/material/Button'
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
import HashTag from '../assets/svg/hashtag.svg'

export const slugify: (text: string) => string = text =>
  text?.replace?.(/ /g, '-').replace(/\//g, '-')

export const getHeadingChildren: (heading: string) => Heading[] = heading => {
  const allMethods = Object.entries(swagger.paths)
    .map(([k, v]) => Object.entries(v))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .flat() as Array<[string, any]>

  return allMethods
    .filter(
      ([, method]) =>
        method.deprecated !== true &&
        method.tags?.[0]?.toLowerCase() === heading
    )
    .map(([methodName, method]) => {
      const title =
        pathsMetadata?.[method.path as '/v1/about/ethereum-rpc/']?.[
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

export const getHeadingsFromHtml: (
  stringifiedHtml: string
) => Heading[] = stringifiedHtml => {
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
          children: getHeadingChildren(headingText.toLowerCase())
        }
      }) ?? []
    )
  }
  return []
}

export const MdxHeading: React.FC<{
  headingLevel: number
  children: ReactNode
}> = ({ headingLevel, children }) => (
  <Typography
    variant={`h${headingLevel}` as 'h1'}
    textTransform='none'
    id={slugify(children as string)}
    sx={{
      mt: headingLevel > 3 ? 2 : 0,
      '&:hover .MuiButton-root': {
        opacity: '1'
      },
      transition: '0.2s'
    }}
  >
    {children as string}{' '}
    {headingLevel > 1 && (
      <Button
        href={`#${slugify(children as string)}`}
        disableRipple
        sx={{
          p: 0,
          minWidth: 12,
          minHeight: 24,
          fontSize: 24,
          backgroundColor: 'transparent',
          color: 'grey.700',
          opacity: '0',
          transition: '0.2s',
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }}
      >
        <HashTag width='15px' height='35px' />
      </Button>
    )}
  </Typography>
)

const getMarkdownHeaderComponent: (
  headingLevel: number
) => React.FC<{ children: ReactNode }> =
  headingLevel =>
  // eslint-disable-next-line @typescript-eslint/promise-function-async
    ({ children }) =>
      MdxHeading({ headingLevel, children })

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
