// Can't use ES6 imports without some work.
const { merge } = require('webpack-merge');
const common = require ('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production'
})
