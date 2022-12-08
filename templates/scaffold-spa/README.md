# Project Name

**The Concept**

A twenty second pitch of the project.


---

## Developer Installation

---

### Prerequisites:

* Nodejs v16.x.x(LTS)
* npm v8.x.x(LTS)

Node installation can be found at the following location: https://nodejs.org/en/download/ . When you install `Nodejs`, `npm` is also installed.


### Environment Variables:

Copy '.env.defaults' file into a new file name '.env' and set the following values:

```
UI_APP_PORT=2022
UI_API_HOST=
```


### Installation

Once the repository is cloned, from the root directory of the project, use the terminal with the following command.

```sh
$ npm install
```

This will install all dependencies needed to run and maintain the project.


### Start Development

When starting Development run the following command.  All code changes made in the `src` directory will be watched and hot released to the current development server.  It should open the web application on your default browser with `http://0.0.0.0:<env:UI_APP_PORT>`

```sh
$ npm start
```

### Exit Development

In the terminal enter `ctrl + c` to end the process.


---

## Developer Contribution Guide

---

### Code style guide

This project uses `eslint` and `stylelint` to enforce a code style.  No errors should be displayed in the terminal. 

> Note: `--fix` is added to the lint command to fix any issues if possible

To check both JavaScript and CSS run:
```sh
$ npm run lint
```

For JavaScript only. See [.eslintrc](.eslintrc) for the configuration.
```sh
$ npm run lint:js
```

- <https://eslint.org/docs/rules/>


For CSS only. See [.stylelintrc](.stylelintrc) for the configuration.
```sh
$ npm run lint:css
```

- <https://stylelint.io/user-guide/rules/>


### Code Unit testing guidelines

All test will be added to the `test/unit` folder from the root directory.  Be sure to end all test files with `*.test.js`.

Jasmine is used for writing unit test.  Please ensure all code has proper unit test before submission.  

To check run:
```sh
$ npm run test
```

Assuming you are developing with VSCode:

Using the [Live server plugin](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) you can open up `test/unit/coverage/lcov-report/index.html` to see the code coverage details.

### Git Feature Branch Workflow

The Feature Branch Workflow assumes a central repository and main represents the official project history. Instead of committing directly on the main branch, developers should create a new branch every time they start work on a new feature or bug fix. 

Branches should have a consistent naming convention. Feature branches can start with `feature/*` and bug fix branches should start with `bugfix/*`. Before a branch is merged to main, it needs to be approved.

> Squash merging is preferred to keep the history and changelog clean and consistent. 


### Addressing feedback

Please review all feedback on a PR(Pull Request).  This is required for a merge.


### Semantic Versioning

We use https://semver.org/ for versioning.

### Commit message format

We use https://www.conventionalcommits.org/en/v1.0.0/ for commit messages.  

**IMPORTANT**
The commit message should follow the conventional commit format.  This is important because it will be added to the changelog if it is a `feat:` or `fix:` comment. Below are some examples.

```
fix: Fix text color in the search bar
feat: Updated tool-tip component with auto placement
```

Below are more examples of other conventional formats.

```
docs: Improve installation documentation
style: Fix indentation and typos in the files
refactor: Use another logo
test: Add tests for a feature
chore: Add new action Jenkins job
```

### Changelog

[Review our latest changes and updates](CHANGELOG.md)

**Developer Setup**

```sh
npm install standard-version --save-dev
```

Add the script to the `package.json` file.

```json
"release": "./node_modules/.bin/standard-version"
```

### Changelog Generation

The following procedure will generate the release notes for the changelog.md

**Only if running for the very first time**
```sh
$ npm run release -- --first-release
```

Before running the release script, find the tagged release version with the following command

```sh
$ npm run release -- --dry-run
```

Create the branch in the following format `release-v*` e.g. `release-v1.10.3`

Final step is to run the release and push the PR(Pull Request) to main.

Running the release script does the following:
1. **bump** the version using the **semver** format.
2. **changelog** generation
3. **commit** the changes
4. **tag** the release

```sh
$ npm run release
```

> Be sure to also push the follow tags but do not run `npm publish`

Format to expect
```sh
$ git push --follow-tags origin <git branch>
```



### Auditing packages

To audit npm packages use
```sh
$ npm audit
```

Have audit fix install semver-major updates to top-level dependencies, not just semver-compatible ones
```sh
$ npm audit fix --force
```

- https://docs.npmjs.com/cli/audit

To check the status of outdated packages
```sh
$ npm outdated
```

- https://docs.npmjs.com/cli-commands/outdated.html

If a package is outdated simply using `$ npm update` will not work with packages that are prefixed ith the caret(**^**). You will need to use the following command
```sh
$ npm install <package_name>@latest
```


### Generate Files for development or production

[Webpack](https://webpack.js.org/) is used to bundle the project for deployment. Files will be generated into a folder called `/dist`.  In development mode, you should be able to view the files in a eligible format vs production will minify the files to maximize download speed.

#### Development Files

```sh
$ npm run build:dev
```

#### Production Files

```sh
$ npm run build
```


### Browser Support

This application will support Desktop and Mobile devices.

| Edge | Chrome | Safari | Mobile |
|:---------:|:---------:|:---------:|:---------:|
| &check; | &check; | &check; | &check; |


### References

This application leverages the use of web components.  Currently we use [Mettle Components](https://johnsonandjohnson.github.io/mettle-components/) for development.

---

## Conclusion

Now that you have reviewed the contribution guide you are ready to contribute.

- Be sure to clone the repository.
- Create your branch from main.
- Develop!
