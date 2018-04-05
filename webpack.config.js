const webpack = require('webpack');

module.exports = {
  entry: [
    __dirname + '/client/components/App.jsx'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/client/dist',
    filename: 'bundle.js',
    library: 'App',
    libraryTarget: 'var'
  }
};