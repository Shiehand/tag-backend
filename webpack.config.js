const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
module.exports = {
	target: "node",
	mode: "development",
	entry: slsw.lib.entries,
	externals: [{ "aws-sdk": "commonjs aws-sdk" }],

	devtool: "inline-cheap-module-source-map",
};
