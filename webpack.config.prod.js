var webpack = require('webpack');
var { resolve } = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var WebpackMD5Hash = require('webpack-md5-hash');

var loaders = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel',
    babelrc: false,
    query: {
      presets: [
        [
          'es2015', { 'modules': false }
        ],
        'react'
      ]
    }
  }, {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
  }, {
    test: /\.html$/,
    loader: 'html'
  }
];

var plugins = [
  new WebpackMD5Hash(),
  new HtmlWebpackPlugin({
    template: './index.html'
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    },
    sourceMap: false
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new ExtractTextPlugin('[chunkhash:8]-style.css', { allChunks: true }),
  new AssetsPlugin({
    filename: 'assets.json',
    path: resolve(__dirname, 'server'),
    prettyPrint: true,
    update: true
  })
];

module.exports = () => {
  return {
    context: __dirname,
    entry: {
      app: './client/main',
      vendor: [ 'react', 'react-dom', 'react-router', 'react-helmet' ]
    },
    devtool: 'hidden-source-map',
    output: {
      filename: '[chunkhash:8]-[name].js',
      chunkFilename: '[chunkhash:8]-[id].bundle.js',
      path: resolve(__dirname, 'build'),
      publicPath: '/static/'
    },
    resolve: {
      extensions: [ '', '.js', '.jsx', '.css' ]
    },
    module: {
      loaders
    },
    plugins,
    postcss: [ autoprefixer({ browsers: 'last 2 versions' }) ]
  };
};
