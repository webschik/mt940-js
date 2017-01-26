const webpack = require('webpack');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./lib/index.js",
        libraryTarget: "commonjs2"
    },

    node: {
        console: false,
        process: false,
        global: false,
        buffer: false,
        __filename: false,
        __dirname: false
    },

    root: [
        __dirname
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css'],
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: ['node_modules'],
                loader: 'ts-loader'
            }
        ]
    }
};