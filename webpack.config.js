const webpack = require('webpack');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./lib/index.js",
        libraryTarget: "commonjs2"
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
                loader: 'ts-loader'
            }
        ]
    }
};