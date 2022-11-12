const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    // sourcce file location
    entry: {
        index: path.resolve(__dirname, "public", "assets", "js", "page", "home.js")
    },
    mode: "development",
    target: "web",
    output: {
        path: path.resolve(__dirname, "public", "assets", "dist"),
        filename: '[name].js'
    },

    // plugins: [new HTMLWebpackPlugin({})],
};