// The path of a page's Markdown copy: no query or hash, no trailing slash, `/` → `/index.md`
const markdownPath = (asPath: string): string => {
  const pathname = asPath.split(/[?#]/)[0]
  const trimmed =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname
  return `${trimmed === '/' ? '/index' : trimmed}.md`
}

const MetaTags: React.FC<{ path: string }> = ({ path }) => {
  const description =
    'Safe Infrastructure is an open-source and modular smart account stack. Learn about its features and how to use it.'

  let ogImagePath = 'og_image.png'
  switch (path) {
    case '/resource-hub':
      ogImagePath = 'og_image_resource_hub.png'
      break
  }

  const image = `${process.env.NEXT_PUBLIC_HOST_URL}/${ogImagePath}`

  return (
    <>
      <meta
        name='robots'
        content={
          process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'
            ? 'index, follow'
            : 'noindex, nofollow'
        }
      />
      <link
        rel='alternate'
        type='text/markdown'
        href={`${process.env.NEXT_PUBLIC_HOST_URL}${markdownPath(path)}`}
      />
      <meta name='description' content={description} />
      <meta property='og:site_name' content='Safe Docs' />
      <meta
        property='og:url'
        content={`${process.env.NEXT_PUBLIC_HOST_URL}${path}`}
      />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:type' content='website' />
      {path === '/' && <meta property='og:title' content='Safe Docs' />}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
    </>
  )
}

export default MetaTags
