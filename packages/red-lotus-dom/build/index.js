'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('react');
var reactDom = _interopDefault(require('react-dom'));

var redLotusDomRender = function redLotusDomRender(App, rootFilePath) {
  reactDom.render();
};

// TODO 在浏览器这边，要用组件而不是 reconciler 的方式？
// 在浏览器里仅仅用 reconciler 还是不行的，因为用户写的组件是按照自己会在 node 里跑去写的，所以可能有  import path from 'path'
// 这样的，如果浏览器这边也要完全相同的跑，那必须提供所有 node 模块在浏览器的实现。。。是不太可能的
// 所以还是起本地 node 服务把，浏览器端只是拿到结果然后渲染


var src = {
  render: redLotusDomRender
};

exports.default = src;
