var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    // Main App.
    "./src/js/index.es6"
  ],

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/js"),
    publicPath:"/js/"
  },

  devServer: {
    contentBase: "./public",
  },

  module: {
    // Transpiles ECMA6 into ECMA5 with babel, enables importing of ES6 and React modules.
    loaders: [
      {
        loader: "babel",
        test: /\.es6$/,
        query: {
          presets: ["es2015", "react"]
        }
      },
      // Enables importing of sass files into the ES6 modules.
      {
        test: /\.sass$/,
        loaders: ["style", "css", "sass"]
      },
      // Enables importing of css files into the ES6 modules.
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      }
    ]
  }
}
