#!/usr/bin/env node
"use strict";

const meow = require('meow');

const start = require('./start');

async function main(cli) {
  const {
    input,
    flags
  } = cli;

  if (input.length !== 1) {
    throw Error(`red-lotus-cli only support one argument like 'start', but now get '${input.join(' ')}'`);
  }

  await start(); // 暂时不支持 flags 了，只支持 .config.js 的方式
  // TODO 如果要支持 flags，需要将 flags 映射成 config 并且不自动去找 .config.js
  // if (flags.prettier) {
  //
  // }
}

const cli = meow(`
    Usage
      $ redlotus start
  
    Options
      --prettier, -p prettier the content of each generated file

    Examples
      $ redlotus start --prettier
  `, {
  flags: {
    prettier: {
      type: 'boolean',
      alias: 'p'
    },
    help: {
      type: 'boolean',
      alias: 'h'
    }
  },
  description: false
});
main(cli);