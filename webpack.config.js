const slsw = require("serverless-webpack");
module.exports = {
	target: "node",
	mode: "development",
	entry: slsw.lib.entries,
	externals: [{ "aws-sdk": "commonjs aws-sdk" }],

	devtool: "inline-cheap-module-source-map",
};
