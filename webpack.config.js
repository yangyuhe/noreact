const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

let plugins = [
    new ManifestPlugin(),
    new webpack.NamedModulesPlugin(),
    new CleanWebpackPlugin(['dist'])
];
let common = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, 'src/' + 'index.ts')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                target: 'ES5'
                            },
                            onlyCompileBundledFiles: true
                        }
                    }
                ]
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2'
    },
    plugins: plugins,
    stats: 'normal'
};
let umd = merge(common, {
    output: {
        filename: '[name].js',
        library: 'noreact',
        libraryTarget: 'umd'
    }
});
let umd_prod = merge(umd, {
    mode: 'production',
    output: {
        filename: '[name].min.js'
    }
});

module.exports = [umd, umd_prod];
