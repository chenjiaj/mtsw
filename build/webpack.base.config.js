/* 引入操作路径模块和webpack */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	/* 输入文件 */
	entry: {
		index: ['babel-polyfill', path.resolve(__dirname, '../client/src/index.js')]
	},
	output: {
		/* 输出目录，没有则新建 */
		path: path.resolve(__dirname, '../dist'),
		/* 静态目录，可以直接从这里取文件 */
		publicPath: '/',
		/* 文件名 */
		filename: 'js/[name].[hash].js',
		chunkFilename: 'js/[name].[chunkhash].js'
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js'
		}
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					css: ExtractTextPlugin.extract({
						use: 'css-loader',
						fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
					}),
					less: ExtractTextPlugin.extract({
						use: 'css-loader!less-loader',
						fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
					})
				}
			}
		}, {
			test: /\.less$/,
			loader: 'less-loader'
		}, {//页面中import css文件打包需要用到
			test: /\.css/,
			loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			/* 排除模块安装目录的文件 */
			exclude: /node_modules/
		}, {
			test: /\.png$|\.jpg$|\.gif$|\.ico$/,
			loader: "file-loader",
			exclude: /node_modules/
		}, {
			test: /\.(woff2|svg|woff|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 150000
			}
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, '../index.html'),
			inject: true
		}),
		new ExtractTextPlugin("style.[hash].css")
	]
};
