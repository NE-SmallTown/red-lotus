const babel = require('@babel/core');
const path = require('path');
const fs = require('fs-extra');
const rollup = require('rollup');
const chalk = require('chalk');

const clean = require('./utils/clean');
const rollupConfigs = require('./utils/rollupConfigs');
const nodePackageBabelConfigPath = path.resolve(__dirname, '../node.babel.config.js');

// const REDLOTUS_ENV = process.env.REDLOTUS_ENV;

function transformDir (dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);

      return;
    }

    files.forEach(fileName => {
      const filePath = path.resolve(dirPath, fileName);

      if (fs.statSync(filePath).isDirectory()) {
        transformDir(filePath);

        return;
      }

      // babel 目前并不是基于 babel core 去封装 CLI 的，有时候并没有与 CLI 等价的 node 调用的方式（如 `--out-dir` https://github.com/babel/babel/issues/9224）
      // 所以这里就自己手动搞了。。（当然这里也可以调 spawn 去调 CLI，但是那样不好）
      babel.transformFile(
        filePath,
        { configFile: nodePackageBabelConfigPath },
        (err, transformRet) => {
          if (err) {
            console.log('babel transformFile error: ', err, filePath);

            return;
          }

          const outputFilePath = filePath.replace('src/', 'build/');

          fs.outputFile(outputFilePath, transformRet.code, err => {
            err && console.log('build.transformFile.writeFile error: ', err);
          });
        },
      );
    });
  });
}

function copyFiles (dirPath) {
  const packageRootPath = path.resolve(dirPath, '../');

  [ 'README.md' ].forEach(fileName => {
    const fileInputPath = path.resolve(packageRootPath, fileName);
    const fileOutputPath = path.resolve(packageRootPath, `build/${fileName}`);

    fs.copySync(fileInputPath, fileOutputPath);
  });
}

function buildNodePackage () {
  const dirsPath = [
    path.resolve(__dirname, '../packages/red-lotus-cli/src'),
    path.resolve(__dirname, '../packages/red-lotus-dom-server/src'),
  ].filter(Boolean);

  dirsPath.forEach(transformDir);
  dirsPath.forEach(copyFiles);
}

function buildNonNodePackage () {
  rollupConfigs.forEach(async rollupConfig => {
    const { inputOptions, outputOptions } = rollupConfig;
    const bundle = await rollup.rollup(inputOptions);

    await bundle.write(outputOptions);
  });
}

function build () {
  console.log(chalk.green('Start building...'));

  clean();

  buildNodePackage();

  buildNonNodePackage();

  console.log(chalk.green('Build completed.'));
}

build();
