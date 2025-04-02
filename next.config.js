const redirections = require('./redirects.json')
const codeHike = require('@code-hike/mdx')
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [
      [
        codeHike.remarkCodeHike,
        { showCopyButton: true, skipLanguages: ['mermaid'], lineNumbers: true }
      ]
    ]
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack (config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: false,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false }
                  }
                }
              ]
            },
            titleProp: true
          }
        }
      ]
    })

    return config
  },
  async redirects () {
    return redirections
  }
}

module.exports = withNextra(nextConfig)
