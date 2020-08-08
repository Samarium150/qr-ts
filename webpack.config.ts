import * as path from "path";
import * as webpack from "webpack";
const config: webpack.Configuration = {
    mode: "development",
    entry: "./lib/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader", "eslint-loader"],
                exclude: [/node_modules/]
            },
        ],
    },
    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ],
    },
    output: {
        globalObject: "this",
        filename: "library.js",
        path: path.resolve(__dirname, "public/javascripts"),
        library: "qr",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    externals: {
        lodash: {
            root: "_",
            commonjs: "lodash",
            commonjs2: "lodash"
        }
    },
    optimization: {
        minimize: true
    }
}
export default config;