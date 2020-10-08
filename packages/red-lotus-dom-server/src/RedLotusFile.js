const { vol: fsMemory } = require('memfs');
const path = require('path');

const { REDLOTUS_CONTENT_TYPE, REDLOTUS_FILE_TYPE } = require('../../shared/RedLotusTags');
const { RedLotusCurrent } = require('./shared');

// 如果没有目录则创建，参考 outputFileSync https://github.com/jprichardson/node-fs-extra/blob/a149f822c387958caba7333ad2830615ab8b078f/lib/output/index.js
const appendTemplateFileToMemory = (filePath, content) => {
  const templateProjectRootPath = RedLotusCurrent.currentRoot.containerInfo.rootPath;
  const absolutePath = `${templateProjectRootPath}/${filePath}`;
  const dir = path.dirname(absolutePath);

  if (fsMemory.existsSync(absolutePath)) {
    // TODO 待调查，貌似 fsMemory 的 appendFileSync 有 bug，比如文件内容是:
    //        const s = 3
    // 这个时候如果 append 随便一个比如 console.log()，最后会变成：
    //        const s = 3
    //      console.log()
    // 而不是
    //        const s = 3
    // console.log()
    return fsMemory.appendFileSync(absolutePath, content);
  } else {
    // file 不存在的话需要先创建
    fsMemory.mkdirSync(dir, { recursive: true });
    fsMemory.appendFileSync(absolutePath, content);
  }
};

exports.createFileInstance = props => {
  const { path, children } = props;

  const fileInstance = {
    tag: REDLOTUS_FILE_TYPE,
    path,
    children,

    // 下面是一个 File instance 应该有的 host 层面的方法，对标一个 DOM node instance
    appendChild (child) {
      if (this !== fileInstance) {
        throw Error(
          `You can only call 'appendChild' by 'fileInstance.appendChild(...), anything else which` +
          `will change the 'this' pointer will throw an error.`
        );
      }

      switch (child.tag) {
        case REDLOTUS_CONTENT_TYPE:
          // 如果 child 是一个 Content，那么把 Content 的内容追加到 parent File 的路径对应的文件中
          return appendTemplateFileToMemory(path, child.text);

        case REDLOTUS_FILE_TYPE:
          // 如果 child 是一个 File，那么什么都不用管，因为对于这个 child，在它 appendChild 的时候，它就把自己写到文件系统里去了
          // 而不需要让这个 File 的父 File 把它写到文件里去
          return null;

        default:
          throw Error(`The File Component only can have File or Content as its child, but now get ${child}.`);
      }
    }
  };

  return fileInstance;
};
