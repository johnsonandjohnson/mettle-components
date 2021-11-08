<img src="./mettle-logo.png" alt="Mettle" width="100"/>

# Mettle Custom Elements

![CodeQL](https://github.com/johnsonandjohnson/mettle-components/workflows/CodeQL/badge.svg)
![npm](https://img.shields.io/npm/v/@johnsonandjohnson/mettle-components?color=203%09206%09220%09&label=NPM%20Package&logo=npm)

A Suite of custom elements to be used on a front-end JavaScript application.

These are built under the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) spec.  These tags can be dropped into any front end application like html. You can use this package in addition to your own or with other custom element packages.

> [Mettle Components Documentation](https://johnsonandjohnson.github.io/mettle-components/?path=/docs/welcome-introduction--page)

## Goals

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

#### Related packages

- Coming soon
