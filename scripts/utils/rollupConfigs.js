const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel').default;
const nodePolyfills = require('rollup-plugin-node-polyfills');
const path = require('path');

const redLotusPkg = require('../../packages/red-lotus/package.json');
const redLotusDomPkg = require('../../packages/red-lotus-dom/package.json');

const redLotusDomPkgExternal = [
  ...Object.keys(redLotusDomPkg.peerDependencies || {}),
  ...Object.keys(redLotusDomPkg.dependencies || {}),
];

const redLotusPkgExternal = [
  ...Object.keys(redLotusPkg.peerDependencies || {}),
  ...Object.keys(redLotusPkg.dependencies || {}),
];

const projectRootPath = path.resolve(__dirname, '../../');

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false;
  }

  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);

  return id => pattern.test(id);
};

// TODO 还是搞个 rollup config generator 吧。。
module.exports = [
  // red-lotus
  {
    inputOptions: {
      input: path.resolve(projectRootPath, 'packages/red-lotus/src/index.js'),
      plugins: [
        babel({
          babelHelpers: 'runtime',
          exclude: 'node_modules/**',
        }),
        resolve(),
        commonjs(),
        nodePolyfills(),
      ],
      external: makeExternalPredicate(redLotusPkgExternal),
    },
    outputOptions: {
      file: path.resolve(projectRootPath, 'packages/red-lotus/build/index.js'),
      format: 'cjs',
      exports: 'named',
    },
  },

  // red-lotus-dom
  {
    inputOptions: {
      input: path.resolve(projectRootPath, 'packages/red-lotus-dom/src/index.js'),
      plugins: [
        babel({
          babelHelpers: 'runtime',
          exclude: 'node_modules/**',
        }),
        resolve(),
        commonjs(),
        nodePolyfills(),
      ],
      external: makeExternalPredicate(redLotusDomPkgExternal),
    },
    outputOptions: {
      file: path.resolve(projectRootPath, 'packages/red-lotus-dom/build/index.js'),
      format: 'cjs',
      exports: 'named',
    },
  },
];
