const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s?css$/,
        use:  [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: './dist'
  }
};
