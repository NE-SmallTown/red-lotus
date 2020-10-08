#!/usr/bin/env node
"use strict";

const execa = require('execa');

const chalk = require('chalk');

const build = require('./build');

const USER_ROOT = process.cwd(); // TODO 起两个服务，一个 node 的去跑（支持热更），一个 webpackDevServer 的（实时预览）
//      是不是应该在 render() {} 里面才去开始起服务？不然一开始就起的话，跑 index.js 的时候，index.js 是没办法让别人给他传参数的
// TODO 感觉浏览器里这么搞太麻烦了。。要不是还是起个本地 node 服务去执行把，浏览器里的直接调接口就行

async function start() {
  try {
    console.log(chalk.green('redlotus cli start....')); // 用 node 执行之前需要先编译（不然直接 node 去跑多半会报错的，很多语法 node 并不支持）

    const {
      output
    } = await build();
    console.log(chalk.green('redlotus cli bundle successfully.')); // 然后用 node 去编译后的入口文件即可

    console.log(chalk.green('redlotus cli execution start...'));
    const execRes = await execa('node', [output.fileName], {
      cwd: USER_ROOT
    });

    if (execRes.stderr) {
      console.log(chalk.red('redlotus cli execute error: ', execRes.stderr));
    }

    console.log(chalk.green('redlotus cli execution end.'));
  } catch (e) {
    console.error(chalk.red('redlotus start error: ', e));
  }
}

module.exports = start;