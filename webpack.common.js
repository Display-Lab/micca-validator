// Can't use ES6 imports without some work.
const path = require('path');
const webpack = require("webpack");
const MomentLocalesPlugin = require('moment-locales-webpack-plugin'); 

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'micca.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'micca',
  },
  module: {},
  plugins: [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        jquery: "jquery",
        d3: 'd3'
    }),
    // Strip all locales except "en" from moment package.
    new MomentLocalesPlugin()
  ]
};
