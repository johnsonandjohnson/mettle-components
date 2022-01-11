module.exports = {
  "core": {
    "builder": "webpack5",
  },
  "staticDirs": ['../public', '../src/services'],
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@whitespace/storybook-addon-html",
  ],
  "framework": "@storybook/html"
}
