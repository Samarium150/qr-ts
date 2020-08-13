import * as path from "path";
import * as webpack from "webpack";
import TypeDocWebpackPlugin from "./typedoc_webpack_plugin";

const config: webpack.Configuration = {
    mode: "development",
    entry: "./lib/index.ts",
    plugins: [
        new TypeDocWebpackPlugin(
            {
                out: path.resolve(__dirname, "public/docs"),
                includeDeclarations: false,
                ignoreCompilerErrors: true,
                plugin: "typedoc-plugin-external-module-name"
            },  "./lib"
        )
    ],
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