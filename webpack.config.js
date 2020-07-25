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
        library: 'qr',
        libraryTarget: 'commonjs2'
    },
    externals: {
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash'
        }
    },
    optimization: {
        minimize: true
    }
};