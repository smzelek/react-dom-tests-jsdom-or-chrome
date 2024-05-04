const os = require('os');
const path = require('path');
const ENTROPY_SIZE = 1000000;
const outputPath = `${path.join(os.tmpdir(), '_karma_webpack_')}${Math.floor(Math.random() * ENTROPY_SIZE)}`;

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.PUBLIC_URL = '';

const TIMEOUT = 100000;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    client: {
      clearContext: false,
      jasmine: {
        random: true,
        seed: '4321',
        oneFailurePerSpec: true,
        failFast: true,
        timeoutInterval: TIMEOUT,
      },
    },
    exclude: ['src/mocks/server.ts'],
    preprocessors: {
      'src/test/setupTests.jasmine.ts': ['webpack'],
      '**/*.spec.tsx': ['webpack'],
      'src/test/setupMockApi.ts': ['webpack'],
    },
    files: [
      'src/test/setupTests.jasmine.ts',
      '**/*.spec.tsx',
      'src/test/setupMockApi.ts',
      'public/mockServiceWorker.js',
      {
        pattern: 'public/**/*',
        included: false,
        watched: false,
      },
      // Fixes images not resolving (1/2): https://github.com/ryanclark/karma-webpack/issues/498
      {
        pattern: `${outputPath}/**/*`,
        watched: false,
        included: false,
      },
    ],
    proxies: {
      '/mockServiceWorker.js': 'http://localhost:9876/base/public/mockServiceWorker.js',
      '/img/': 'http://localhost:9876/base/public/img/',
      '/sprites/': 'http://localhost:9876/base/public/sprites/',
    },
    webpack: {
      // Fixes images not resolving (2/2): https://github.com/ryanclark/karma-webpack/issues/498
      output: {
        path: outputPath,
      },
      mode: 'development',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {
          src: path.resolve(__dirname, 'src/'),
        },
      },
      module: {
        rules: [
          {
            test: /\.(js|ts|jsx|tsx)$/,
            exclude: /node_modules\/(?!(@ionic-internal)\/).*/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-typescript', 'babel-preset-react-app'],
              },
            },
          },
          {
            test: /\.(css|scss)$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
          {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
          },
          {
            test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
            use: {
              loader: 'file-loader',
              options: {
                publicPath: '',
              },
            },
          },
        ],
      },
      stats: 'errors-only',
      target: ['web', 'es5'],
      devtool: 'eval-cheap-source-map',
    },
    webpackMiddleware: {
      stats: 'errors-only',
    },
    reporters: ['kjhtml', 'spec'],
    plugins: ['karma-jasmine', 'karma-webpack', 'karma-chrome-launcher', 'karma-jasmine-html-reporter', 'karma-spec-reporter'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: process.env.CI ? ['ChromeHeadlessNoSandbox'] : ['Chrome'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    singleRun: process.env.CI ? true : false,
    concurrency: Infinity,
  });
};
