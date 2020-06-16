// Can't use ES6 imports without some work.
const path = require('path');
var webpack = require("webpack");

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
    })
  ]
};
