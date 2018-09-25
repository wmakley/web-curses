const path = require("path");

module.exports = function (env, argv) {
  const PRODUCTION = (argv.mode === "production");

  return {
    entry: "./src/Main.ts",
    output: {
      filename: "bundle.js",
      path: path.join(__dirname, "dist")
    },

    devtool: PRODUCTION ? "source-map" : "inline-source-map",

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },

    devServer: {
      contentBase: path.join(__dirname, "static"),
      port: 9000,
      publicPath: "/dist/",
      overlay: {
        warnings: true,
        errors: true
      },
      watchContentBase: true
    }
  };
};
