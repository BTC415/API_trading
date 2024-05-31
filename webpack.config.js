const webpack = require('webpack');
const path = require('path');

/* Global */
const resolve = {
  extensions: ['.es6', '.js'],
  alias: {
    process: 'process/browser',
    '@axios': 'axios'
  },
  fallback: {
    buffer: false,
    stream: false,
    fs: false,
    assert: false,
    constants: false,
    crypto: false,
    http: false,
    https: false,
    process: false,
    url: false,
    util: false,
    zlib: false,
    path: false,
    net: false,
    os: false
  }
};

/* configs */
const swcESM = require('./swc/swcrc.esm');
const webESM = {
  mode: 'production',
  entry: './lib/index.es6',
  devtool: 'source-map',

  target: 'web',

  module: {
    rules: [
      {
        loader: 'swc-loader',
        options: swcESM,
        test: /\.es6$/,
        exclude: /(node_modules)/
      }
    ]
  },

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dists/esm/'),
    library: {
      type: 'module',
    }
  },

  experiments: {
    outputModule: true,
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
  ],

  resolve
};

const swcrcUMD = require('./swc/swcrc.umd');
const webUMD = {
  entry: './lib/index.es6',
  target: 'web',
  mode: 'production',
  devtool: 'source-map',
  
  module: {
    rules: [
      {
        loader: 'swc-loader',
        test: /\.es6$/,
        exclude: /(node_modules)/,
        options: swcrcUMD
      }
    ]
  },

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dists/umd/'),
    globalObject: 'this',
    library: {
      name: 'CopyFactory',
      type: 'umd',
      export: 'default'
    }
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
  ],

  resolve
};

const swcrcCJS = require('./swc/swcrc.cjs');
const nodeCJS = {
  entry: './lib/index.es6',
  target: 'node',
  mode: 'production',
  devtool: 'source-map',

  module: {
    rules: [
      {
        loader: 'swc-loader',
        test: /\.es6$/,
        exclude: /(node_modules)/,
        options: swcrcCJS
      }
    ]
  },

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dists/cjs/'),
    library: {
      type: 'commonjs'
    }
  },
  
  resolve: {
    extensions: ['.es6', '.js'],
    alias: {
      '@axios': 'axios'
    }
  }
};

module.exports = [ webESM, webUMD, nodeCJS ];
