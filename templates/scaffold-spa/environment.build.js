const { resolve } = require('path')
require('dotenv-extended').load({
  errorOnMissing: true,
  path: resolve(__dirname, '.env')
})
const UI_ENV_VARS = Object.entries(process.env)
  .filter(([key]) => key.startsWith('UI_'))
  .reduce((acc, [key, val]) =>
    ({...acc, [key]:val})
  , {})
module.exports = UI_ENV_VARS
