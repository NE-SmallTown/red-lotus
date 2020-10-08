"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

const {
  vol: fsMemory
} = require('memfs');

const fs = require('fs-extra');

const rimraf = require('rimraf');

const prettier = require('prettier');

const RedLotusConfig = require('../../shared/RedLotusConfig'); // 将 memory 中的文件同步到本地文件系统中


const commitMemoryToLocalFs = templateRootPath => {
  const fsMemoryData = fsMemory.toJSON();
  const redLotusConfig = RedLotusConfig.get();

  try {
    (0, _keys.default)(fsMemoryData).forEach(filePath => {
      let fileContent = fsMemoryData[filePath];

      if (redLotusConfig.prettier) {
        fileContent = prettier.format(fileContent, redLotusConfig.prettier);
      }

      fileContent = fileContent.trim(); // 最后移除文件首尾中可能多余的空白符

      fs.outputFile(filePath, fileContent);
    });
  } catch (e) {
    console.log(`Commit to local file system error: `, e);
    console.log('Will rollback the existed creation');
    rimraf(templateRootPath);
  }
};

exports.createRootInstance = (element, container) => {
  return {
    isRoot: true,
    rootPath: container,
    children: element,
    // 对于 root 而言，他的 appendChild 实际上是把整个文件树创建出来了（在这之前整个文件树是在 fs memory 里面，和 DOM render 是一样的）
    commitToFs: () => {
      // 这里不需要 create 一个 root 目录，因为 outputFile 的时候，没有根目录会自动创建
      commitMemoryToLocalFs(container);
    }
  };
};