import { type ReactNode } from 'react'
import Link from 'next/link'
import { type SxProps } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MuiLink from '@mui/material/Link'
import {
  CopyToClipboard,
  Code,
  Pre,
  Td,
  Table,
  Th,
  Tr
} from 'nextra/components'

import HashTag from '../assets/svg/hashtag.svg'
import { slugify } from '../lib/mdx'

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

const getMarkdownHeaderComponent: (
  headingLevel: number
) => React.FC<{ children: ReactNode }> =
  headingLevel =>
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  ({ children }) =>
    MdxHeading({ headingLevel, children })

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
