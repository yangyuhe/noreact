const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let shouldClearDir = process.argv[1].indexOf('webpack-dev-server') == -1;
let plugins = [
    new ManifestPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
];
if (shouldClearDir) plugins.push(new CleanWebpackPlugin(['bundle']));

module.exports = {
    mode: 'development',
    entry: { main: path.resolve(__dirname, 'demo/index.tsx') },
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
            },
            {
                test: /\.scss/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.((ttf)|(woff2)|(woff)|(eot)|(svg))$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'dist/www/loaders')]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'bundle'),
        chunkFilename: '[name].bundle.js',
        publicPath: 'http://localhost:8004/'
    },
    plugins: plugins,
    devServer: {
        historyApiFallback: true,
        hot: true,
        stats: { colors: true },
        host: 'localhost',
        port: '8004'
    },
    stats: 'normal'
};
