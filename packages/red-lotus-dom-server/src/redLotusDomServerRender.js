const React = require('react');
const ReactReconciler = require('react-reconciler');
const { vol: fsMemory } = require('memfs');
const fs = require('fs-extra');
const rimraf = require('rimraf');

const { REDLOTUS_CONTENT_TYPE, REDLOTUS_FILE_TYPE } = require('../../shared/RedLotusTags');
const { checkContentChildren, checkFileChildren } = require('./utils');
const RedLotusFile = require('./RedLotusFile');
const RedLotusContent = require('./RedLotusContent');
const RedLotusRoot = require('./RedLotusRoot');
const { RedLotusCurrent } = require('./shared');

// TODO 这玩意没暴露出来啊？？？为啥 noop-renderer 可以 require 得到？
// const ReactRootTags = require('react-reconciler/src/ReactRootTags');
const ReactRootTags = {
  LegacyRoot: 0,
  BlockingRoot: 0,
  ConcurrentRoot: 0,
};

const RedLotusDomServerRenderer = ReactReconciler({
  supportsMutation: true, // it works by mutating nodes

  // createInstance 在创建 host node（element type 为 string）的时候调用
  // https://github.com/facebook/react/blob/0c52e24cb65a8f1c370184f58ee2d5601a3acd7f/packages/react-reconciler/src/ReactFiber.new.js#L480
  createInstance (type, props) {
    // console.log('createInstance', type, props);

    switch (type) {
      case REDLOTUS_FILE_TYPE: {
        checkFileChildren(props.children);

        return RedLotusFile.createFileInstance(props);
      }

      case REDLOTUS_CONTENT_TYPE: {
        checkContentChildren(props.children);

        return RedLotusContent.createContentInstance(props);
      }

      default: {
        throw Error(`Wrong Component type: ${type} , please file an issue.`);
      }
    }
  },

  // 节点插入已存在于界面上的 DOM 的那次插入
  // 懂了。。。React 只会在最终那次插入到 parent 的时候调用 reconciler 提供的 appendChild
  // 比如把 <div><span><span><div> 插入到 <p> 里面，只有插入 p 的时候才会调用 appendChild
  // 而把 span 插入到 div 里面是不会调用 appendChild 的。。。那他调的是什么呢？他会调用 appendInitialChild 。。。
  appendChild (parent, child) {
    // console.log('appendChild');
    // console.log(parent, child);
  },

  // 节点未插入已存在于界面上的 DOM 之前的（在 VDOM 中）自身内部的插入
  // 具体看上面的注释
  appendInitialChild (parentInstance, child) {
    // console.log('appendInitialChild', parentInstance, child);

    switch (parentInstance.tag) {
      case REDLOTUS_FILE_TYPE:
      case REDLOTUS_CONTENT_TYPE:
        return parentInstance.appendChild(child);

      default:
        throw Error(`Wrong type received by appendInitialChild ${parentInstance.tag}, please file an issue.`);
    }
  },

  createTextInstance (
    text,
    rootContainerInstance,
    internalInstanceHandle,
  ) {
    // console.log('createTextInstance', text, rootContainerInstance, internalInstanceHandle);

    return text;
  },

  // commit 阶段
  // 将 root 节点下的每个 child instance（对应 DOM 里的 DOM instance）append 到 root 节点对应的 instance 里面去
  // 即，对于 root 下的第一层的每个 child node instance 都会调用此方法，这些 node 的 parentInstance 都为 root instance
  // <div>    // 这个对应的 DOM instance 即为 root instance
  //  <div><span></span><div> // 这里的 div（注意是 div，而不是 div 对应的 React 组件）会调用 appendChildToContainer，但是 span 不会

  //  <div><span></span><div> // 这里的 div 和上同
  // <div>
  //
  //
  // 有个问题，appendChildToContainer 停止的条件是什么？他是怎么知道这个 node 没有办法再继续 append 了（比如 textNode 节点）
  // 知道了，JSX 里面没有 child 就说明不能去 append 了（自然不会（因为根本就没有）调 appendChild 了）
  // 而 appendChildToContainer 是看是不是 container
  // https://github.com/facebook/react/blob/23595ff593b2e53ddfec2a08e848704d15d84b51/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1280
  // 只有一开始的 render 或者 portal 才会调用 appendChildToContainer
  appendChildToContainer (parentInstance, child) {
    // console.log('appendChildToContainer', parentInstance, child);

    // 严格来讲，这里其实只应该把 child commit 到 fs 中
    // 但是那样有点麻烦（懒）。。
    // 另外主要是一个模板 project 的生成其实不关心到底是整体生成还是一个个生成（这样后面的报错了前面的还是会生成）
    // 而是只关心最终生成的 project，所以假如有的 child 报错了，那这个 project 就算什么都没生成也是合理的，而不是像 DOM 那样直接红屏了
    parentInstance.commitToFs();
  },

  getPublicInstance (instance) {
    return instance;
  },

  commitUpdate (instance, updatePayload, type, oldProps, newProps) {
    // console.log('commitUpdate', instance, updatePayload, type, oldProps, newProps);
  },

  prepareUpdate (instance, type, oldProps, newProps) {
    // console.log('prepareUpdate', instance, type, oldProps, newProps);
  },

  // TODO 下面的这些不加跑不起来，原因还未知，他们是干啥的也还未知
  getRootHostContext: function () {
    return null;
  },
  prepareForCommit: function () {
    return null;
  },
  resetAfterCommit: function () {

  },
  getChildHostContext: function () {
    return null;
  },
  shouldSetTextContent: function () {
    return false;
  },
  finalizeInitialChildren: function () {
    return null;
  },
});

module.exports = {
  // container 在逻辑上和任意 node（child） 应该是具有相同接口的一个对象（如在浏览器里都是 DOM instance）
  // 所以这样才能直接调用 appendChild，而不用管这个 instance 到底是个啥（是个 container 还是 node/child）
  render (element, container) {
    // 与 DOM.render 行为保持一致
    // 如果调用 render 的时候 root 节点已经有东西了，则先干掉里面的东西
    fsMemory.existsSync(container) && fsMemory.unlinkSync(container);
    fs.existsSync(container) && rimraf.sync(container);

    const rootContainer = RedLotusRoot.createRootInstance(element, container);
    const prevCurrentRoot = RedLotusCurrent.currentRoot;

    try {
      const fiberRoot = RedLotusDomServerRenderer.createContainer(
        rootContainer,
        ReactRootTags.BlockingRoot,
        false,
        null,
      );

      RedLotusCurrent.currentRoot = fiberRoot;

      RedLotusDomServerRenderer.updateContainer(
        element,
        fiberRoot,
        null,
        null,
      );
    } catch (e) {
      console.log('RedLotus.createContainer/updateContainer error', e);
    } finally {
      RedLotusCurrent.currentRoot = prevCurrentRoot;
    }
  }
};
