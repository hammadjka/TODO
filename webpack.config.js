const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        page1: './src/pages/page1/index.js',
    },
    devtool: 'inline-source-map',
    module: {
    rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        }, 
        {
            test: /\.(html)$/,
            use: ['html-loader']
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        }
    ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: './src/pages/page1/index.html',
            filename: 'all.html',
            chunks: ['page1']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/projects/projects.html',
            filename: 'projects.html',
            chunks: ['page1']
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static: './dist',
        watchFiles: ['./src/pages/page1/index.html', './src/pages/projects/projects.html'],
    },
};