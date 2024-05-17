const { join } = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {
  getBuildTimeConstantsPlugins,
} = require('./build-tools/build-time-constants');

module.exports = (env) => {
  const IS_PRODUCTION = !!env.production;

  return {
    mode: IS_PRODUCTION ? 'production' : 'development',

    devtool: IS_PRODUCTION ? undefined : 'inline-source-map',

    entry: {
      app: ['./src/index.ts'],
    },

    output: {
      path: join(__dirname, 'dist'),
    },

    watch: !IS_PRODUCTION,

    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
      ],
    },

    plugins: [...getBuildTimeConstantsPlugins(IS_PRODUCTION)].concat(
      IS_PRODUCTION ? [new CleanWebpackPlugin()] : []
    ),

    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })],
    },

    optimization: {
      minimize: false,
      moduleIds: IS_PRODUCTION ? 'deterministic' : 'named',
    },

    stats: {
      children: false,
    },

    externals: {
      sharp: 'commonjs sharp',
      'puppeteer-extra': "require('puppeteer-extra')",
      'puppeteer-extra-plugin-stealth':
        "require('puppeteer-extra-plugin-stealth')",
      'puppeteer-extra-plugin-anonymize-ua':
        "require('puppeteer-extra-plugin-anonymize-ua')",
    },
  };
};
