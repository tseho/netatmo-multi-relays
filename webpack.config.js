const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'node',
  entry: './src/index.ts',
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
