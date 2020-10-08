#!/usr/bin/env node

const resolve = require('@rollup/plugin-node-resolve').default;
const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const path = require('path');
const rollup = require('rollup');
const chalk = require('chalk');

const RedLotusConfig = require('../../shared/RedLotusConfig');
const USER_ROOT = process.cwd();

const makeExternalPredicate = (packageExternalArr, stringExternalArr = []) => {
  if (packageExternalArr.length === 0 && stringExternalArr.length === 0) {
    return () => false;
  }

  const pattern = new RegExp(`^(${packageExternalArr.join('|')})($|/)`);

  return id => pattern.test(id) || stringExternalArr.some(str => str.indexOf(id) !== -1);
};

module.exports = async function build () {
  console.log(chalk.green('redlotus cli build....'));

  const redLotusConfig = await RedLotusConfig.get();
  const { entry } = redLotusConfig;
  const userPackageJSON = require(path.resolve(USER_ROOT, 'package.json'));
  const outputFileName = path.resolve(USER_ROOT, 'red-lotus-build/index.js');

  const userPackageExternal = [
    ...Object.keys(userPackageJSON.peerDependencies || {}),
    ...Object.keys(userPackageJSON.dependencies || {}),
  ];

  const rollupConfig = {
    inputOptions: {
      input: entry,
      plugins: [
        babel({
          configFile: path.resolve(__dirname, 'redlotus-build-babel.config.js'),
          babelHelpers: 'bundled',
          exclude: 'node_modules/**',
        }),
        resolve(),
        commonjs(),
        nodePolyfills(),
      ],
      external: makeExternalPredicate(userPackageExternal),
    },

    outputOptions: {
      file: outputFileName,
      format: 'cjs',
      exports: 'auto',
    },
  };

  const { inputOptions, outputOptions } = rollupConfig;
  const bundle = await rollup.rollup(inputOptions);

  await bundle.write(outputOptions);

  console.log(chalk.green('redlotus cli build completed.'));

  return {
    output: {
      fileName: outputFileName,
    },
  };
};
