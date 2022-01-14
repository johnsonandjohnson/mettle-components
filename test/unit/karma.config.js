// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.3/config/configuration-file.html

const { join, resolve } = require('path')

module.exports = function (config) {
  config.set({
    autoWatch: false,
    basePath: '',
    browsers: ['ChromeHeadless'],
    colors: true,
    concurrency: Infinity,
    coverageIstanbulReporter: {
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
      { included: true, pattern: 'index.test.js', type: 'module', watched: false },
    ],
    frameworks: ['jasmine', 'webpack'],
    logLevel: config.LOG_INFO,
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
      mode: 'production',
      module: {
        rules: [
          {
            enforce: 'post',
            exclude: /(node_modules|index\.js|\.test\.js)$/,
            test: /\.js/,
            include: resolve('src/'),
            use: '@jsdevtools/coverage-istanbul-loader'
          }
        ]
      },
      resolve: {
        alias: {
          elements: resolve(__dirname, '../..', 'index.js'),
          helper: resolve(__dirname, 'helper.js'),
          mixins: resolve(__dirname, '../..', 'mixins.js'),
          services: resolve(__dirname, '../..', 'services.js'),
        },
        extensions: ['.js']
      },
      target: "web",
    },
    webpackMiddleware: {
      noInfo: true
    }
  })
}
