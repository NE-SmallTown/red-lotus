module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: false,
        targets: {
          node: '10',
        },
      },
    ],

    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',

    // we can just import 'core-js' as polyfill so we can remove this
    // but that's not a problem for now so I will leave it here temporarily
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2,
        helpers: false,
        regenerator: true,
        useESModules: false,
      },
    ],
  ],
};
