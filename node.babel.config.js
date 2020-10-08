module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'cjs',
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
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    ],
  ],
};
