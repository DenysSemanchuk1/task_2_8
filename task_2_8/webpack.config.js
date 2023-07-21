const path = require("path");

module.exports = {
  devtool: "eval-source-map",
  entry: "./src/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", {
          loader: "sass-loader",
          options: {
            sassOptions: {
              outputStyle: "compressed",
            },
            webpackImporter: false,
            implementation: require("sass"),
            sassOptions: {
              fiber: false,
            },
          },
        },],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", '.scss'],
  },
  output: {
    publicPath: "/",
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
    },
    compress: true,
    port: 8080,
  },
};
