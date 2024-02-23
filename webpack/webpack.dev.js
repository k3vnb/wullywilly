const webpackCommon = require('./webpack.common');

module.exports = {
  ...webpackCommon,
  mode: 'development',
  devServer: {
    static: './dist',
  }
};
