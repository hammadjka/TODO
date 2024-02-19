const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        all: './src/pages/page1/allTasks.js',
        projects: './src/pages/projects/projects.js',
        projectTasks: './src/pages/projects/projectTasks.js',
        thisWeek: './src/pages/thisWeek/thisWeek.js',
        today: './src/pages/today/today.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
    rules: [
        {
            test: /.s?css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
            test: /\.(html)$/,
            use: ['html-loader'],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },

        
    ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: './src/pages/page1/all.html',
            filename: 'all.html',
            chunks: ['all']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/projects/projects.html',
            filename: 'projects.html',
            chunks: ['projects']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/projects/projectTasks.html',
            filename: 'projectTasks.html',
            chunks: ['projectTasks']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/thisWeek/thisWeek.html',
            filename: 'thisWeek.html',
            chunks: ['thisWeek']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/today/today.html',
            filename: 'today.html',
            chunks: ['today']
        }),
        new MiniCssExtractPlugin({
            filename: '[name].min.css', // Output minified CSS filename
        }),
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(), // Minify CSS files
        ],
    },
    devServer: {
        static: './dist',
        watchFiles: ['./src/pages/page1/all.html', 
        './src/pages/projects/projects.html', 
        './src/pages/projects/projectTasks.html',
        './src/pages/thisWeek/thisWeek.html',
        './src/pages/today/today.html'
        ],
    },
};