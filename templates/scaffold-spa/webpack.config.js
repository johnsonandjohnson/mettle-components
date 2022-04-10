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
      port: 2022,
    },
    entry: './src/main.js',
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
      },
      extensions: ['.js']
    },
  }
}
