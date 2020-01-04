const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

let plugins = [
    new ManifestPlugin(),
    new webpack.NamedModulesPlugin(),
    new CleanWebpackPlugin(['dist'])
];

module.exports = {
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
        path: path.resolve(__dirname, 'dist')
    },
    plugins: plugins,
    stats: 'normal'
};
