# How to contribute
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Submitting an issue

Every feature or bug fix should have an associated GitHub issue. This should be created prior to beginning development and, ideally, should be tagged as "accepted" before any actual work is begun.

### Feature Story

A feature story should be written in the behavior-driven development (BDD) process.

> [To learn now about behavior-driven development (BDD)](https://en.wikipedia.org/wiki/Behavior-driven_development)

### Bug Fixes

For bugs, the issue should clearly specify the Steps to reproduce with the Actual behavior. Please be clear about the expected behavior and provide details like device, browser, screenshots or video of the issue.

## Code style guide

This project uses `eslint:recommended` to review your code style.  No errors should be displayed in the terminal.

To check run:
```sh
$ npm run lint
```


## Code Unit testing guidelines

Mocha is used for writing unit test.  Please ensure all code has proper unit test before submission.  

To check run:
```sh
$ npm run test
```

## Code Documentation

We use [Storybook](https://storybook.js.org/) for documentation.

When adding a new feature please review the documentation to ensure the new feature is properly documented as a story. 

Bugfix's should review the stories related to ensure everything is correct and up to date.

While in development run:
```sh
$ npm run storybook
```

To generate the docs for a Pull Request (PR):
```sh
$ npm run build-storybook
```


## Semantic Versioning

We use https://semver.org/ for versioning mettle.

## Commit message format

We use https://www.conventionalcommits.org/en/v1.0.0/ for commit messages.  

## Pull Request (PR)

Once a pull request receives the required approvals, it will be merged to the main branch.

All pull requests must be merged using Squash and merge strategy.

When using Squash and merge strategy, a new squash commit that contains all the changes from the pull request is created by the GitHub. This commit is going to get merged into the main branch.

**IMPORTANT**
The PR title should follow the conventional commit format with the github issue number.  This is important because it will be added to the changelog if it is a `feat:` or `fix:` comment. Below are some examples.

```
fix: Fix text color in the search bar (#4)
docs: Improve installation documentation (#15)
style: Fix indentation and typos in the files  (#16)
refactor: Use another logo  (#23)
test: Add tests for a feature  (#42)
chore: Add new action Github job (#69)
feat: Updated Mettle-tool-tip component with auto placement (#696) 
```

#### Release version number

In order to create a release with a specified version add this description to your PR merge.

```
Release-As: 2.0.0
```

### Manual Release

In the event that `please-release` is not functioning, the following procedure will
generate the release notes

Before running the release command, find the tagged release version with the following command

```sh
$ npm run release -- --dry-run
```

Create the branch in the following format `release-v*` e.g. `release-v1.10.3`

Final step is to run the release and push to main.

```sh
$ npm run release
```

> Be sure to also push the follow tags but do not run `npm publish`


## Addressing feedback

Please review all feedback on a PR.  This is required for a merge.

## Developer Installation

Now that you have reviewed the contribution guide you are ready to contribute.

- Be sure to fork the repository.
- Clone your forked repository.
- run `$ npm install` from the root directory.

Now that the setup is done
- Create your branch from main.
- Develop!

Happy Contributing!
