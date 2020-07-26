'use strict'
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './lib/index.ts',
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
        filename: 'library.js',
        path: path.resolve(__dirname, 'public/javascripts'),
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
        minimize: true
    }
};