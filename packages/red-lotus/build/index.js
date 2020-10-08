'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Object$defineProperty = _interopDefault(require('@babel/runtime-corejs2/core-js/object/define-property'));
var _Object$defineProperties = _interopDefault(require('@babel/runtime-corejs2/core-js/object/define-properties'));
var _Object$getOwnPropertyDescriptors = _interopDefault(require('@babel/runtime-corejs2/core-js/object/get-own-property-descriptors'));
var _Object$getOwnPropertyDescriptor = _interopDefault(require('@babel/runtime-corejs2/core-js/object/get-own-property-descriptor'));
var _Object$getOwnPropertySymbols = _interopDefault(require('@babel/runtime-corejs2/core-js/object/get-own-property-symbols'));
var _Object$keys = _interopDefault(require('@babel/runtime-corejs2/core-js/object/keys'));
var _defineProperty = _interopDefault(require('@babel/runtime-corejs2/helpers/defineProperty'));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _require = require('../../shared/RedLotusTags'),
    REDLOTUS_FILE_TYPE = _require.REDLOTUS_FILE_TYPE,
    REDLOTUS_CONTENT_TYPE = _require.REDLOTUS_CONTENT_TYPE;

var sharedComponentTypes = {
  File: REDLOTUS_FILE_TYPE,
  Content: REDLOTUS_CONTENT_TYPE
};

if (typeof window !== 'undefined') {
  module.exports = _objectSpread(_objectSpread({}, require('red-lotus-dom/src')), sharedComponentTypes);
} else {
  module.exports = _objectSpread(_objectSpread({}, require('red-lotus-dom-server/src')), sharedComponentTypes);
}
