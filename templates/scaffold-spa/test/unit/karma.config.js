// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.3/config/configuration-file.html

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UI_ENV_VARS = require('../../environment.build')
const { join, resolve } = require('path')

module.exports = karma => karma.set({
    autoWatch: false,
    basePath: '',
    browsers: ['ChromeHeadless'],
    colors: true,
    concurrency: Infinity,
    coverageIstanbulReporter: {
      combineBrowserReports: true,
      dir: join(__dirname, 'coverage'),
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: false,
      reports: ['lcov', 'text-summary']
    },
    customLaunchers: {
      ChromeCustom: {
        base: 'ChromeHeadless',
        flags: []
      }
    },
    files: [
      { included: false, pattern: resolve(__dirname, '../..', 'assets/*.{gif,jpeg,jpg,png,svg}'), nocache: false, served: true, watched: false },
      { included: false, pattern: resolve(__dirname, '../..', 'assets/locales/*.json'), nocache: false, served: true, watched: false },
      { included: true, pattern: 'index.test.js', type: 'module', watched: false },
    ],
    frameworks: ['jasmine', 'webpack'],
    logLevel: karma.LOG_INFO,
    plugins: [
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-jasmine'),
      require('karma-webpack'),
    ],
    port: 9876,
    preprocessors: {
      'index.test.js': ['webpack'],
    },
    reporters: ['coverage-istanbul', 'dots'],
    singleRun: true,
    webpack: {
      externals: {
        environment: JSON.stringify(UI_ENV_VARS)
      },
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
          {
            test: /\.(eot|ttf|woff|woff2|gif|jpeg|jpg|png|svg)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.html$/i,
            exclude: /index\.html$/i,
            type: 'asset/source',
          },
          {
            enforce: 'post',
            exclude: /(node_modules|index\.js|\.test\.js|main\.js)$/,
            test: /\.js/,
            include: resolve(__dirname, '../..', 'src/'),
            use: '@jsdevtools/coverage-istanbul-loader'
          },
        ]
      },
      plugins: [
        new MiniCssExtractPlugin(),
      ],
      resolve: {
        alias: {
          helper: resolve(__dirname, 'helper.js'),
          components: resolve(__dirname, '../..', 'src/components'),
          features: resolve(__dirname, '../..', 'src/features'),
          services: resolve(__dirname, '../..', 'src/services'),
          templates: resolve(__dirname, '../..', 'src/templates')
        },
        extensions: ['.js']
      },
      target: 'web',
    },
    webpackMiddleware: {
      noInfo: true
    }
  })

