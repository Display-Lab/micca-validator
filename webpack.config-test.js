var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node', // webpack should compile node compatible code
  mode: 'development',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.(csv|xlsx)$/,
        use: [ 'raw-loader', ],
      },
    ],
  },
  output: {
    devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  devtool: '#inline-cheap-module-source-map',
};
