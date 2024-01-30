# <img src="/public/favicon.svg" height="60" valign="middle" alt="Safe{Docs}" />

[![License](https://img.shields.io/github/license/safe-global/safe-docs)](https://github.com/safe-global/safe-docs/blob/main/LICENSE.md)
<!-- ![Tests](https://img.shields.io/github/actions/workflow/status/safe-global/safe-docs/test.yml?branch=main&label=tests) -->
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/safe-global/safe-docs)

# Safe Docs

This is [Safe](https://safe.global)'s documentation website, built with [Nextra](https://nextra.site). Live version can be found at [docs.safe.global](https://docs.safe.global).

## Quick Start

First, run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start the development server and visit localhost:3000.

## Build

Run `pnpm build` to build the site. The output will be in the `out` folder.

Run `pnpm start` to serve the site locally.

## Test

Run `pnpm test` to run the tests.

## License

This project is licensed under the [MIT License](./LICENSE.md).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request by following our [contributions guidelines](./CONTRIBUTING.md).

Git hooks are set up to run tests and linting before every push. You can run these hooks locally with `pnpm prepush`.

All links will also be checked for validity on every pull request. You can check them locally with `pnpm linkcheck`.

