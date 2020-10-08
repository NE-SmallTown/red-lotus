# red-lotus

A tiny engine of file and template generation powered by React.

This project is inspired by a [tweet](https://twitter.com/dan_abramov/status/1285471956305956864) of Dan Abramov

# Motivation

Today, the normal way to create a file and fill some text into it is directly call the node API like `fs.writeFileSync`.
At most time it's ok, but for a complex (node)library especially for a scaffold, it's hard and annoying to create and concat
the file content. That's why we often use a template engine to do this. And then we have to maintain a lot of
template engine logic/syntax(condition, iteration, ...) and constant variables like `{{ NAMESPACE_FOO_OPTION_BAR }}` in that file.

If so, how we maintain those variables/logic? And how we communicate them with all kinds of upstream/libs?

That bothers me, so I create red-lotus.

# Installation

`npm i red-lotus red-lotus-cli`

# Usage

## Use it out of box

```javascript
// index.js

const path = require('path');
const React = require('react');
const RedLotus = require('red-lotus');

const { File, Content } = RedLotus

function HelloFile(props) {
  const { platform } = props;

  return (
    React.createElement(
      File,
      { path: 'hello.js' },
      React.createElement(
        Content,
        null,
        `console.log('${ platform === 'node' ? 'Hello Node!' : 'Hello React!' }');`
      )
    )
  );
}

const rootContainer = path.resolve(__dirname, 'this-is-the-generation-result-root-path');

RedLotus.render(React.createElement(HelloFile, { platform: 'node' }), rootContainer);
```

The result will be:

```bash
root
   |-- this-is-the-generation-result-root-path
   |   |-- hello.js
```

```javascript
// hello.js

console.log('Hello Node!');
```

After run `node ./index.js`, you will see that there will be a directory named `this-is-the-generation-result-root-path`
which has a `hello.js` file in it. And the content of `hello.js` is `console.log('Hello Node!');`.

## Use ES Module and JSX by `red-lotus-cli`

The above example don't use JSX and ES Module because Node doesn't support them natively at now.

But of course you can write ES Module and JSX and then compile it to the syntax supported by Node by using a tool like Babel.

Also, you can use red-lotus-cli which helps you do that.

All you need to do is write a `red-lotus.config.js` in your root path:

```javascript
// red-lotus.config.js

const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
};
```

And then run `npx redlotus start` or add `"wooo": "redlotus start"` into the `scripts` field of your `package.json` and
then run `npm run wooo`.

It will works same as the above example.

You can find a whole example [here](./examples/basic).

# Supported Environments

- Node.js 10+
- Chrome (WIP)

# How it works

TBD

# Contributing

TBD
