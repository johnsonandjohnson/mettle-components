const UI_ENV_VARS = require('./environment.build')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { resolve } = require('path')

module.exports = (env, argv) => {
  const IS_BUILD = env.WEBPACK_BUILD
  return {
    devServer: {
      historyApiFallback: {
        rewrites: [
          { from: /.*\.html?/, to: '/' },
          { from: /^[\w/]+$/, to: '/' },
        ],
        verbose: true
      },
      host: '0.0.0.0',
      open: true,
      port: UI_ENV_VARS.UI_APP_PORT,
    },
    entry: './src/main.js',
    externals: {
        Environment: JSON.stringify(UI_ENV_VARS)
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.html$/i,
          exclude: /index\.html$/i,
          type: 'asset/source',
        },
      ],
    },
    output: {
      assetModuleFilename: 'assets/[name][ext]',
      clean: true,
      filename: 'main.js',
      path: resolve(__dirname, 'dist'),
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        base: IS_BUILD ? false : '/',
        inject: 'body',
        template: './src/index.html',
        scriptLoading: 'module'
      }),
    ],
    resolve: {
      alias: {
        components: resolve(__dirname, 'src/components'),
        features: resolve(__dirname, 'src/features'),
        services: resolve(__dirname, 'src/services'),
        templates: resolve(__dirname, 'src/templates'),
      },
      extensions: ['.js']
    },
  }
}
