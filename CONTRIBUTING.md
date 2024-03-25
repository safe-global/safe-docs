# Contributing

Thank you for contributing to the Safe docs. Before starting, please review the existing documentation to understand the structure and writing conventions.

We use the [Microsoft Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/) for the styles and [Vale](https://vale.sh/docs/) for linting. This combination helps us use the style guide effectively.

## Submitting to Resource Hub

Please open an [issue](https://github.com/safe-global/safe-docs/issues/new?assignees=&labels=resource-hub&projects=&template=resource-hub-submission.yml&title=%5BResource+Hub%5D+) to submit a resource to our Resource Hub.

### Resource Hub approval process

The Safe team will review the submission and provide feedback. Once the submission is approved, the Safe team will merge the submission into the Resource Hub, by:
<!-- vale off -->
- Adding the new entry (`url`, `tags`, and `date`) to the [community-resources.json](./components/ResourceHub/community-resources.json) file;
- Running the `pnpm get-resources-og` script to fetch Open Graph metadata for the new resource automatically;
- (Optional) Edit the copy for `name` and `description`.
<!-- vale on -->

## Using Vale

Install the [Vale CLI](https://vale.sh/docs/vale-cli/installation/) and run the following command: 

```
vale --glob='*.md' .
```

You can also use Vale as a plugin for your IDE.
