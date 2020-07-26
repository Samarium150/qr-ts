'use strict'
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './lib/index.ts',
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            root: 'qr',
            commonjs: "qr-lib"
        },
        libraryTarget: 'umd'
    },
    externals: {
        lodash: {
            root: '_',
            commonjs: 'lodash',
            commonjs2: 'lodash'
        }
    },
    optimization: {
        minimize: false
    }
};