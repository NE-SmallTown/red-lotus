module.exports = {
  parser: 'babel-eslint',
  extends: [
    'standard',
    'standard-react',
    'heaven'
  ],
  rules: {
    'array-bracket-spacing': [
      2,
      'always',
      {
        objectsInArrays: false,
        singleValue: true,
      }
    ],
    indent: 0, // 太难配了。。干脆不要了
  },
  plugins: [
    'babel',
    'react',
    'promise'
  ],
  globals: {
    __DEV__: 'writable',
  },
};
