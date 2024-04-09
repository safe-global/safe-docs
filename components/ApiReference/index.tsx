import { renderToString } from 'react-dom/server'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import TOC from './TOC'

import { getHeadingsFromHtml, MDXComponents } from '../../lib/mdx'
import Mdx from './generated-reference.mdx'

const ApiReference: React.FC = () => {
  const renderedMdx = <Mdx components={MDXComponents} />
  const contentString = renderToString(renderedMdx)
  const headings = getHeadingsFromHtml(contentString)

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TOC headings={headings} />
        </Grid>
        <Grid item xs={12} md={5}>
          {renderedMdx}
        </Grid>
        <Grid item xs={12} md={4}></Grid>
      </Grid>
    </Container>
  )
}

export default ApiReference
