const { cosmiconfig } = require('cosmiconfig');

const RedLotusConfig = {
  init: async () => {
    const explorer = cosmiconfig('red-lotus', {
      searchPlaces: [ 'red-lotus.config.js', 'red-lotus.config.json', 'package.json' ],
    });

    const config = (await explorer.search(process.cwd())).config;

    if (!config) {
      throw Error('No red-lotus config found, please create it follow to the doc.');
    }

    const { prettier: userPrettierConfig } = config;

    if (userPrettierConfig) {
      // 支持 bool 值（用自己默认的配置）
      if (typeof userPrettierConfig === 'boolean') {
        config.prettier = {
          parser: 'babel',
        };
      } else if (typeof userPrettierConfig === 'string') {
        // 也支持传入一个字符串（代表 prettier.config.js 的文件 path）
        const userPrettierConfigPath = userPrettierConfig;

        config.prettier = require.resolve(userPrettierConfigPath, [ process.cwd() ]);
      } else if (typeof userPrettierConfig === 'object') {
        // 也支持传入一个 object（即 redlotus 配置）
        config.prettier = userPrettierConfig;
      } else {
        throw Error(`The 'prettier' field must be an object/string/boolean, but got ${typeof userPrettierConfig}`);
      }
    }

    RedLotusConfig.set(config);

    return config;
  },

  config: null,

  set: config => (RedLotusConfig.config = config),

  get: async () => {
    if (RedLotusConfig.config === null) {
      await RedLotusConfig.init();
    }

    return RedLotusConfig.config;
  },
};

module.exports = RedLotusConfig;
