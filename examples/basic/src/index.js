import path from 'path';
import React from 'react';
import RedLotus from 'red-lotus';

import App from './App';

const rootContainer = path.resolve(__dirname, '../generated-project-by-red-lotus');

function createApp (options) {
  RedLotus.render(<App { ...options } />, rootContainer);
}

createApp({
  useWebpackHmr: true,
  useReactHotLoaderHmr: false,
  fileList: [
    {
      fileName: 'foo.js',
      platform: 'web',
    },
    {
      fileName: 'bar.js',
      platform: 'app',
    },
  ]
});
