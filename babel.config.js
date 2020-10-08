module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // TODO targets
        modules: false,
        useBuiltIns: false, // 用了 @babel/plugin-transform-runtime 里的 corejs 了，这个自然就要禁掉了
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
