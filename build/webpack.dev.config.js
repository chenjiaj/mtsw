const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const webpack = require('webpack');

let devConfig =  merge(baseConfig, {
	entry: {
		index:[
			'webpack-hot-middleware/client?reload=1',
			'./client/src/index.js'
		]
	},
	output: {
		path: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
});

module.exports = devConfig;
