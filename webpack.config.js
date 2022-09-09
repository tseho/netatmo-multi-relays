const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'node',
  externals: {
    "express": "require('express')"
  },
  entry: {
    daemon: './src/daemon.ts',
    server: './src/server.ts',
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'babel-loader',
    }]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  output: {
    path: path.join(__dirname, 'build'),
  },
};
