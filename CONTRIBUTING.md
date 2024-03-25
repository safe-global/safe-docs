# Contributing

Thank you for contributing to the Safe docs. Before starting, please review the existing documentation to understand the structure and writing conventions.

We use the [Microsoft Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/) for the styles and [Vale](https://vale.sh/docs/) for linting. This combination helps us use the style guide effectively.

## Submitting to Resource Hub

Please open an [issue](https://github.com/safe-global/safe-docs/issues/new?assignees=&labels=resource-hub&projects=&template=resource-hub-submission.yml&title=%5BResource+Hub%5D+) to submit a resource to our Resource Hub.

### Adding Resources to Resource Hub

[For the Safe team] To add a new resource to the Resource Hub, follow these steps:
- Add the new entry (`type`, `url`, `tags`, and `date`) to the [community-resources.json](./components/ResourceHub/community-resources.json) or [company-resources.json](./components/ResourceHub/company-resources.json) file.
    ```
    {
        "url": "https://example.com",
        "type": "Blog Post",
        "date": "2023-10-09",
        "tags": [
        "Tutorial"
        ]
    }
    ```
- Run `pnpm get-resources-og` to fetch open graph metadata for the new resource automatically.
- Copy edit the automatically generated copy for `name` and `description`.

## Using Vale

Install the [Vale CLI](https://vale.sh/docs/vale-cli/installation/) and run the following command: 

```
vale --glob='*.md' .
```

You can also use Vale as a plugin for your IDE.
