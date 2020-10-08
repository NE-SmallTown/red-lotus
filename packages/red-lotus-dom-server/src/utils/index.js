const React = require('react');

const { REDLOTUS_CONTENT_TYPE } = require('../../../shared/RedLotusTags');

exports.checkContentChildren = children => {
  React.Children.forEach(children, child => {
    if (typeof child !== 'string') {
      throw Error(`The Content component can only have text as its child, but now get ${typeof child}.`);
    }
  });
};

exports.checkFileChildren = children => {
  React.Children.forEach(children, child => {
    if (child.type !== REDLOTUS_CONTENT_TYPE) {
      throw Error(`The File component can only have Content component as its child, but now get ${child.type}.`);
    }
  });
};

// 获取一段文本中每一行前置的空白符最少有多少个
exports.getContentMinPrefixSpaceCount = content => {
  let minSpaceCount = Infinity;

  content.split('\n').forEach(lineContent => {
    // 空行应该跳过
    if (lineContent.trim() === '') {
      return;
    }

    let spaceCount = 0;

    for (let i = 0; i < lineContent.length; i++) {
      const char = lineContent[i];

      if (char.trim() === '') {
        spaceCount++;
      } else {
        break;
      }
    }

    if (spaceCount < minSpaceCount) {
      minSpaceCount = spaceCount;
    }
  });

  return minSpaceCount;
};
