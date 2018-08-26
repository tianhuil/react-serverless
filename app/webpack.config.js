var path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack")

module.exports = (env, argv) => ({
  entry: [
    path.resolve(__dirname, 'src', 'js', 'app.js')
  ],
  devServer: {
    contentBase: "./dist",
    port: process.env.APP_PORT || 80,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader"
      }
    }],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.EnvironmentPlugin([
      'API_HOST',
      'API_PORT'
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})
