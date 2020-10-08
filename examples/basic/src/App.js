import React from 'react';
import { File, Content } from 'red-lotus';

// TODO eslint 貌似是直接取关键字的，所以下面的 JSX 里面的 import 直接报错了。。
/* eslint-disable */

// TODO 此文件里能用其实有点怪。。。到底可以用 node 还是浏览器的 API 呢？。。。貌似都不可以
//      理论上应该是用 node 的 API 的，如 path.resolve, fs.readFile 等等，但是这玩意浏览器也要跑。。所以。。
function EntryFile(props) {
  const { fileName, useWebpackHmr, useReactHotLoaderHmr, platform }  = props;

  let hmrContentElement;

  if (useWebpackHmr) {
    hmrContentElement = (
      <Content>
          {`
            import React from 'react'
    
            let CommonApp
    
            class App extends React.Component {
              render() {
                return (
                  <CommonApp { ...this.props } />
                )
              }
            }
            
            const render = () => {
              // this is a comment
              // this is another comment
              
              CommonApp = require("./bar/app").default
  
              AppRegistry.runApplication('${fileName}', { rootTag: document.getElementById('root') })
            }

            if(module.hot) {
              module.hot.accept('./foo/app', () => {
                render()
              })
            }
    
            registerApp('${fileName}', App)
    
            render()
          `}
      </Content>
    );
  } else if (useReactHotLoaderHmr) {
    hmrContentElement = (
      <Content>
        import App from './foo/app';

        registerApp('{ fileName }', App);
        AppRegistry.runApplication('{ fileName }', { "{ rootTag: document.getElementById('root') }" });
      </Content>
    );
  } else {
    hmrContentElement = (
      <Content>
        import App from './bar/app';

        registerApp('{ fileName }', App);
        AppRegistry.runApplication('{ fileName }', { "{ rootTag: document.getElementById('root') }" });
     </Content>
    );
  }

  return (
    <File path={ fileName }>
      { hmrContentElement }

      <Content>console.log('{ platform === 'web' ? 'Hello World Web!' : 'Hello World APP!' }');</Content>
    </File>
  );
}

export default function App(props) {
  const { fileList, ...rest } = props;

  // TODO File 里面嵌套 File
  return fileList.map((buildConfig, index) => (
    <EntryFile key={ index } { ...buildConfig } { ...rest } />
  ));
};
