const os = require("os");
const path = require("path");
const ENTROPY_SIZE = 1000000;
const outputPath = `${path.join(os.tmpdir(), "_karma_webpack_")}${Math.floor(Math.random() * ENTROPY_SIZE)}`;

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.PUBLIC_URL = '';

if (process.env.CI) {
  process.env.CHROME_BIN = "/usr/bin/google-chrome";
}

const TIMEOUT = 100000;

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    client: {
      jasmine: {
        random: true,
        seed: '4321',
        oneFailurePerSpec: true,
        failFast: true,
        timeoutInterval: TIMEOUT
      }
    },
    exclude: [],
    preprocessors: {
      "**/*.test.tsx": ["webpack"],
      "setupTests.ts": ["webpack"],
    },
    files: [
      "setupTests.ts",
      "**/*.test.tsx",
      // Fixes images not resolving (1/2): https://github.com/ryanclark/karma-webpack/issues/498
      {
        pattern: `${outputPath}/**/*`,
        watched: false,
        included: false
      }
    ],
    webpack: {
      // Fixes images not resolving (2/2): https://github.com/ryanclark/karma-webpack/issues/498
      output: {
        path: outputPath
      },
      mode: "development",
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".css"]
      },
      module: {
        rules: [
          {
            test: /\.(js|ts|jsx|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-typescript",
                  "babel-preset-react-app",
                ]
              }
            }
          },
          {
            test: /\.(css|scss)$/,
            use: [
              "style-loader",
              "css-loader",
            ]
          },
          {
            test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
            use: {
              loader: "file-loader",
              options: {
                publicPath: ""
              }
            }
          },
        ],
      },
      stats: "errors-only",
    },
    webpackMiddleware: {
      stats: "errors-only",
    },
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: process.env.CI ? ["ChromeHeadlessNoSandbox"] : ["Chrome"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    singleRun: false,
    concurrency: Infinity,
  });
};
