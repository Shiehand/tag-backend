/**
 * Based from https://github.com/SamWSoftware/ServerlessYoutubeSeries/tree/l45-debugging
 */
const Responses = {
	/**
	 * Success response
	 * @param {object} data data to be included in the body of the response
	 * @returns the response object
	 */
	_200(data = {}) {
		return {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Methods": "*",
				"Access-Control-Allow-Origin": "*",
			},
			statusCode: 200,
			body: JSON.stringify(data),
		};
	},

	/**
	 * Error response
	 * @param {object} data data to be included in the body of the response
	 * @returns the response object
	 */
	_400(data = {}) {
		return {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Methods": "*",
				"Access-Control-Allow-Origin": "*",
			},
			statusCode: 400,
			body: JSON.stringify(data),
		};
	},
};

module.exports = Responses;
