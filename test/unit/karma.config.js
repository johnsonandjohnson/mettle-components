// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.3/config/configuration-file.html

module.exports = function (config) {
  config.set({
    autoWatch: false,
    basePath: '',
    browsers: ['ChromeHeadless'],
    colors: true,
    concurrency: Infinity,
    coverageReporter: {
      dir: './coverage',
      subdir: '.',
      includeAllSources: true,
      reporters: [
          { type: 'lcov' },
          { type: 'text-summary' }
      ]
    },
    customLaunchers: {
      ChromeCustom: {
        base: 'ChromeHeadless',
        flags: []
      }
    },
    files: [
      { included: true, pattern: '../../src/**/*.js', type: 'module', watched: false },
      { included: true, pattern: 'elements/index.test.js', type: 'module', watched: false },
    ],
    frameworks: ['jasmine', 'webpack'],
    logLevel: config.LOG_INFO,
    plugins: [
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine'),
      require('karma-webpack'),
    ],
    port: 9876,
    preprocessors: {
      '../../src/**/*.js': ['coverage'],
      'elements/index.test.js': ['webpack'],
    },
    reporters: ['coverage', 'dots'],
    singleRun: true,
    webpack: {
      mode: 'production',
      target: "web",
    },
    webpackMiddleware: {
      noInfo: true
    }
  })
}
