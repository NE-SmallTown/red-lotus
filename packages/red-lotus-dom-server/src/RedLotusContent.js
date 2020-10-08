const React = require('react');

const { REDLOTUS_CONTENT_TYPE } = require('../../shared/RedLotusTags');
const { getContentMinPrefixSpaceCount } = require('./utils');
const RedLotusConfig = require('../../shared/RedLotusConfig');

exports.createContentInstance = props => {
  const { children } = props;
  let contentText = React.Children.toArray(children).join('');
  const redLotusConfig = RedLotusConfig.get();

  if (!redLotusConfig.prettier) {
    // 如果 prettier 为 false，这个时候 contentText 里每一行前面都可能有若干空白符
    // 因为他可能用的 {`
    //      ....
    //      ....
    // `}
    // 这样的方式
    // 所以这里需要我们移除每一行前多余的空白符
    // 到底要移除多少个呢（不能直接 trim()，因为代码本身是有缩进的））？应该以 contentText 中一行里最短的前置空白符个数为准
    const minPrefixSpaceCount = getContentMinPrefixSpaceCount(contentText);
    console.log(1111, minPrefixSpaceCount);

    contentText = contentText
      .split('\n')
      .map(lineContent => lineContent.slice(minPrefixSpaceCount))
      .join('\n');
  }

  // 由于 JSX 不会依据 JSX 里的换行去添加 \n，所以要想换行，只能自己每行手动加 \n（很麻烦）
  // 所以更方便的办法（除了自己写 babel 插件或者等 JSX 支持自定义配置之外）是要求每行必须加分号
  // 这样即便 JSX 不添加 \n，也能依靠 prettier 这种工具根据分号自动去格式化（添加换行）
  const contentInstance = {
    tag: REDLOTUS_CONTENT_TYPE,
    text: contentText,

    appendChild (child) {
      if (this !== contentInstance) {
        throw Error(
          `You can only call 'appendChild' by 'contentInstance.appendChild(...), anything else` +
          `which will change the 'this' pointer will throw an error.`
        );
      }

      // 由于这是在 Node 端，不会出现 <Content> 里面的 children 发生变化的情况（因为 React 在 Node 端还不支持异步更新）
      // 所以不需要像下面这样，而直接依赖于一开始 createContentInstance 返回的 text 的就行了
      // this.text = prettier.format(React.Children.toArray(getCurrentChildren()).join(''), { parser: 'babel' }),
    }
  };

  return contentInstance;
};
