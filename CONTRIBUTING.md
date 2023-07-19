# Contributing

## Reporting Issues

If you have found what you think is a bug, please
[file a bug report](https://github.com/willnguyen1312/zoom-image/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml)

## Suggesting new features

If you are here to suggest a feature, please
[file a feature proposal](https://github.com/willnguyen1312/zoom-image/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml)

## Development Workflow

- Fork this repository
- Ensure you have `pnpm` installed
- Implement your according changes lead by [Development section](./README.md#development)
- Document your changes in the appropriate documentation website markdown pages
- Commit your work and open a pull request
- Submit PR for review

## Adding a new example

- Create a new example into the appropriate `examples` directory
- Name the example in kebab-case following convention of `with-framework`
- Update the new example's package.json to match the new example name and any other details
- Check dependencies for unused packages
- Install any additional packages to the example that you may need
- Add the example to the `ignore` section in `.changeset/config.json`
