import * as path from "path";
import * as webpack from "webpack";
import TypeDocWebpackPlugin from "./typedoc_webpack_plugin";

const config: webpack.Configuration = {
    entry: "./lib/index.ts",
    plugins: [
        new TypeDocWebpackPlugin(
            {
                out: path.resolve(__dirname, "public/docs"),
                includeDeclarations: false,
                ignoreCompilerErrors: true,
                plugin: ["typedoc-plugin-external-module-name", "typedoc-plugin-extras"],
                favicon: path.resolve(__dirname, "public/images/favicon.ico"),
                hideDate: true,
                hideTime: true
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
    }
}
export default config;