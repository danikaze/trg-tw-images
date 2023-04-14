/*
 * Don't touch this file.
 * This is used internally by the webpack configurations
 */
const { DefinePlugin } = require('webpack');
const { join } = require('path');
const packageJson = require('../package.json');
const getGitData = require('./git');

module.exports = { getBuildTimeConstantsPlugins };

/**
 * @param buildData { dev: boolean, isTest: boolean }
 *
 * @returns array with the plugins for webpack with the defined
 *          build time constants
 */
function getBuildTimeConstantsPlugins(prod) {
  const rawConstants = getConstants(prod);
  const constants = stringify(rawConstants);

  return [new DefinePlugin(constants)];
}

function getConstants(prod) {
  const gitData = getGitData();
  const constants = {
    IS_PRODUCTION: prod,
    PACKAGE_NAME: packageJson.name,
    PACKAGE_VERSION: packageJson.version,
    COMMIT_HASH: gitData.rev,
    COMMIT_HASH_SHORT: gitData.shortRev,
    PROJECT_ROOT: join(__dirname, '..'),
  };

  if (process.env.PRINT_BUILD_CONSTANTS === 'true') {
    printConstants(constants);
  }

  return constants;
}

function stringify(data) {
  return Object.entries(data).reduce((res, [key, value]) => {
    res[key] = JSON.stringify(value);
    return res;
  }, {});
}

function printConstants(constants) {
  console.log(`Build-time constants:`);
  const table = { ...constants };
  const printableTable = {};
  Object.keys(table)
    .sort()
    .forEach((key) => {
      const value = table[key];
      if (Array.isArray(value)) {
        printableTable[key] = `[${value.join(',')}]`;
      } else if (typeof value === 'object') {
        printableTable[key] = JSON.stringify(value);
      } else {
        printableTable[key] = value;
      }
    });
  console.table(printableTable);
}
