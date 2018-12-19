const path = require("path")

module.exports = {
    mode:"development",
    entry: {
        "homepage": path.resolve(__dirname,"src/www"+"/main.ts")
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts','.tsx','.js']
    },
    
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: {
                loader: "ts-loader"
            }
        }]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname,"bundle")
    },
    plugins: [
    ],
    devServer: {
        historyApiFallback: true,
        hot:true
    }
}