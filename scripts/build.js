'use strict';

require('@babel/register');

const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');

// Settings
const settings = require('../settings/local');

// Fabric HTTP Types
// const Compiler = require('@fabric/http/types/compiler');

const Compiler = require('../types/compiler');

// Components
const HubUI = require('../components/interface');

// Program Body
async function main (input = {}) {
  const site = new HubUI(input);
  const compiler = new Compiler({
    document: site,
    webpack: {
      mode: settings.mode || 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.css$/,
            use: [
              { loader: 'style-loader' },
              { loader: 'css-loader' }
            ]
          }
        ]
      },
      target: 'web'
    },
    ...input
  });

  await compiler.compileTo('assets/index.html');

  return {
    site: site.id
  };
}

// Run Program
main(settings).catch((exception) => {
  console.error('[BUILD:SITE]', '[EXCEPTION]', exception);
}).then((output) => {
  console.log('[BUILD:SITE]', '[OUTPUT]', output);
});
