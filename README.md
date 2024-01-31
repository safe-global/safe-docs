# Safe Documentation

[![License](https://img.shields.io/github/license/safe-global/safe-docs)](https://github.com/safe-global/safe-docs/blob/main/LICENSE.md)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/safe-global/safe-docs)

This repository hosts [Safe](https://safe.global) documentation.

The project is built using [Nextra](https://nextra.site) framework and it can be found live at [docs.safe.global](https://docs.safe.global).

## Installation

Install the project:

```
pnpm install
```

## Development

Git hooks are set up to run tests and linting checks before every `git push`. These hooks can be executed locally by running the following command:

```
pnpm prepush
```

All links in the documentation are checked for validity on every pull request. These checks can be executed locally by running the following command:

```
pnpm linkcheck
```

## Execution

The project can be run with a server that's executed in development and production mode.

### Development mode

Run the server in development mode:

```
pnpm dev
```

### Production mode

Build the project:

```
pnpm build
```

Run de server in production mode:

```
pnpm start
```

## Testing

Create an environment file in the root of the project and copy the content from the `.env.example` file:

```
touch .env
```

```
NEXT_PUBLIC_HOST_URL='http://localhost:3000'
NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID=
NEXT_PUBLIC_GOOGLE_ANALYTICS_DOMAIN=
```

Run the tests:

```
pnpm test
```

## License

This project is licensed under the [MIT License](./LICENSE.md).

## Contributing

Contributions are more than welcome! Please open an issue or create a pull request by following our [contributions guidelines](./CONTRIBUTING.md).
