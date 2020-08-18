var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  devServer: { historyApiFallback: true, host: '0.0.0.0' },
  externals: { config: JSON.stringify({ apiUrl: 'http://localhost:9090/api' }) }
}
