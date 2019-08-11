const path = require("path");
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack=require("webpack");
const config=require("./app.json");

let plugins=[
    new ManifestPlugin(),
    new webpack.NamedModulesPlugin(),
    new CleanWebpackPlugin(['bundle'])
];

module.exports = {
    mode:"development",
    entry: {
        "bootstrap": path.resolve(__dirname,"www/"+"bootstrap.ts")
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts','.tsx','.js'],
        modules:[path.resolve(__dirname,'node_modules')]
    },
    
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: "ts-loader",
                options:{
                    compilerOptions:{
                        "target": "ES5",
                        "module": "esnext"
                    },
                    onlyCompileBundledFiles:true
                }
            },{
                loader:"stylename-loader"
            }],
            include:path.resolve(__dirname,"www")
        },{
            test:/\.scss/,
            use:[
            {
                loader:"css-loader"
            },
            {
                loader:"sass-loader"
            }],
            include:path.resolve(__dirname,"www")
        },{
            test:/\.((ttf)|(woff2)|(woff)|(eot)|(svg))$/,
            use:[{
                loader:"url-loader",
                options:{
                    limit: 8192,
                    name: '[name].[ext]'
                }
            }],
            include:path.resolve(__dirname,"www")
        }]
    },
    resolveLoader:{
        modules:["node_modules",path.resolve(__dirname,"dist/www/loaders")]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname,"bundle"),
        chunkFilename: '[name].bundle.js',
        publicPath:"static/"
    },
    plugins: plugins,
    devServer: {
        historyApiFallback: true,
        hot:true,
        stats: { colors: true },
        host:config.webpack_host,
        port:config.webpack_port
    },
    stats:"normal"
}