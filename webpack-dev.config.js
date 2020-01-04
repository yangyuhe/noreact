const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

let shouldClearDir = process.argv[1].indexOf('webpack-dev-server') == -1;
let plugins = [
    new ManifestPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
];
if (shouldClearDir) plugins.push(new CleanWebpackPlugin(['bundle']));

// let entries={bootstrap:path.resolve('www','bootstrap.ts')};
let entries = {};
let dir = path.resolve(__dirname, 'demo');
let files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith('.tsx')) {
        let name = file.substr(0, file.length - 4);
        entries[name] = path.resolve(dir, file);
    }
});

module.exports = {
    mode: 'development',
    entry: entries,
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
                                module: 'esnext',
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
