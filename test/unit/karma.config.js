// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { resolve } = require('path')

module.exports = function (config) {
  config.set({
    autoWatch: false,
    basePath: '',
    browsers: ['ChromeHeadless'],
    colors: true,
    concurrency: Infinity,
    coverageIstanbulReporter: {
      combineBrowserReports: true,
      dir : 'test/unit/coverage/',
      fixWebpackSourcePaths: true,
      reports: ['html', 'lcovonly', 'text-summary'],
      skipFilesWithNoCoverage: false
    },
    customLaunchers: {
      ChromeCustom: {
        base: 'ChromeHeadless',
        flags: []
      }
    },
    files: [
      { included: true, pattern: 'elements/index.test.js', type: 'module' },
    ],
    frameworks: ['chai', 'mocha', 'sinon', 'sinon-chai', 'webpack'],
    logLevel: config.LOG_INFO,
    plugins: [
      require('karma-chai'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha'),
      require('karma-sinon'),
      require('karma-sinon-chai'),
      require('karma-webpack')
    ],
    port: 9876,
    preprocessors: {
      'elements/index.test.js': ['webpack'],
    },
    reporters: ['progress', 'coverage-istanbul'],
    singleRun: true,
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            enforce: 'post',
            exclude: /(node_modules|index\.js|\.test\.js)$/,
            include: resolve('src/'),
            test: /\.js$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
          }
        ]
      },
      resolve: {
        extensions: ['.js']
      },
    },
    webpackMiddleware: {
      noInfo: true
    }
  })
}
