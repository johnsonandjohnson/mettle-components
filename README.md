<img src="./mettle-logo.png" alt="Mettle" width="100"/>

# Mettle Custom Elements

[![CodeQL](https://github.com/johnsonandjohnson/mettle-components/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/johnsonandjohnson/mettle-components/actions/workflows/codeql-analysis.yml)
![npm](https://img.shields.io/npm/v/@johnsonandjohnson/mettle-components?color=41%20170%2070&label=NPM%20Package&logo=npm)
[![Unit Test](https://github.com/johnsonandjohnson/mettle-components/actions/workflows/unit-test.yml/badge.svg)](https://github.com/johnsonandjohnson/mettle-components/actions/workflows/unit-test.yml)
[![codecov](https://codecov.io/gh/johnsonandjohnson/mettle-components/branch/main/graph/badge.svg?token=UTNVOBVM4G)](https://codecov.io/gh/johnsonandjohnson/mettle-components)

A Suite of custom elements to be used on a front-end JavaScript application.

These are built under the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) spec.  These tags can be dropped into any front end application like html. You can use this package in addition to your own or with other custom element packages.

> [Mettle Components Documentation](https://johnsonandjohnson.github.io/mettle-components/?path=/docs/welcome-introduction--page)

### Goals

- [x] Use native JS for little to no dependency
- [x] Cross browser support
- [x] Flexible for CSS
- [x] Unit tested

## Project Installation

```sh
$ npm install @johnsonandjohnson/mettle-components --save
```

To include the components to your code

```js
import '@johnsonandjohnson/mettle-components'
```

### Quick Sample

```html
<html>
  <head>
    <title>Mettle Component Example</title>
  </head>
  <body>
    <span id="id-44629472-5691-4c53-b7f0-c5488854761b">
      Hover or tap me for tip
    </span>
    <mettle-tool-tip
      data-for="id-44629472-5691-4c53-b7f0-c5488854761b">
        <p>Slot HTML/Text</p>
    </mettle-tool-tip>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@johnsonandjohnson/mettle-components/index.js"></script>
  </body>
</html>
```
## Changelog

[Review our latest changes and updates](CHANGELOG.md)

## Contributing

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)


Contributions are welcomed!  

- Please read our [Contribution guidelines](CONTRIBUTING.md) to learn more about the process.
- Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

#### Related packages

- Coming soon
