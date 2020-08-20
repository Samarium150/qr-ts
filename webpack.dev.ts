import {merge} from "webpack-merge";
import config from "./webpack.config";

export default merge(config, {
    mode: "development",
    devtool: "cheap-module-eval-source-map"
});