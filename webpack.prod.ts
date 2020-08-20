import {merge} from "webpack-merge";
import config from "./webpack.config";
import esBuild from "esbuild-minimizer-webpack-plugin";

export default merge(config, {
    mode: "production",
    devtool: "cheap-module-source-map",
    performance: {
        hints: false
    },
    optimization: {
        minimize: true,
        minimizer: [
            new esBuild()
        ]
    }
});