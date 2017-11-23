const webpack = require('webpack');

module.exports = {
	entry    : './src/index.ts',
	watch    : true,
	output   : {
		filename: './dist/bundle.js'
	},
	resolve  : {
		extensions: [ ".ts", ".js" ]
	},
	module   : {
		rules: [
			{test: /\.(t|j)sx?$/, use: {loader: 'awesome-typescript-loader'}},
			// {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
		]
	},
	externals: {},
	// devtool  : "source-map",
	// plugins  : [s
	// 	new webpack.ProvidePlugin({
	// 		_: 'lodash'
	// 	})
	// ]
	plugins  : [
		new webpack.optimize.UglifyJsPlugin({
			compress: {warnings: false}
		})
	]
}