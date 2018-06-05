const path = require('path');

const SRC_DIR = path.join(__dirname, '/react-client/src');
const DIST_DIR = path.join(__dirname, '/react-client/dist');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({
  filename: 'bundle.css',
});

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  module: {
    loaders: [{
      test: /\.jsx?/,
      include: SRC_DIR,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015'],
      },
    },
    {
      test: /\.(s*)css$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
    ],
  },
};
