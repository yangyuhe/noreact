const path = require("path");
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack=require("webpack");

let shouldClearDir=process.argv.indexOf("--hot")==-1;
let plugins=[
    new ManifestPlugin()  
];
if(shouldClearDir)
    plugins.push(new CleanWebpackPlugin(['bundle']));

module.exports = {
    mode:"development",
    entry: {
        "bootstrap": path.resolve(__dirname,"src/www/pages"+"/bootstrap.ts")
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts','.tsx','.js']
    },
    
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: "ts-loader",
                options:{compilerOptions:{
                    "module": "esnext",
                    "target": "ES5"
                }}
            },{
                loader:"stylename-loader"
            }]
        },{
            test:/\.scss/,
            use:[{
                loader:"style-loader"
            },
            {
                loader:"css-loader"
            },
            {
                loader:"sass-loader"
            }]
        }]
    },
    resolveLoader:{
        modules:["node_modules",path.resolve(__dirname,"dist")]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname,"bundle"),
        chunkFilename: '[name].bundle.js',
    },
    plugins: plugins,
    devServer: {
        historyApiFallback: true,
        hot:true,
        stats:"normal"
    },
    stats:"normal"
}