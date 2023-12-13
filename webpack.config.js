const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, './src/index.tsx'),
    output: {
        filename: 'static/js/[name].js',
        path: path.join(__dirname, './dist'),
        clean: true,
        publicPath: '/'
    },
    devtool: 'eval-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /.(ts|tsx)$/,
                use: { loader: "babel-loader", options: { presets: ['@babel/preset-react', '@babel/preset-typescript'] } }
            },
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts'],
        alias: { '@': path.join(__dirname, './src') },//配置@为src目录

    },
    plugins: [
        new HtmlWebPackPlugin({ template: path.resolve(__dirname, './public/index.html'), inject: true }),
        new ReactRefreshWebpackPlugin(),
    ],
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "./public"),
        }
    }
};
