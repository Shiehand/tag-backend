"use strict";

const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

/**
 * Lambda function to query sensor data
 * tagId must be a path parameter
 * t is an optional query string parameter to filter how old the query result that will be returned
 */
export async function handler(event) {
	console.log(event);
	if (!event.pathParameters || !event.pathParameters.tagId) {
		return Responses._400({ message: "missing path parameters" });
	}

	const tagId = event.pathParameters.tagId;
	var duration;

	if (!event.queryStringParameters) {
		duration = null;
	} else {
		let splitString = event.queryStringParameters.t.split(/(\d+)/);
		let multiplier;
		let num = parseInt(splitString[1]);
		if (num === NaN) {
			return Responses._400({
				message: "Invalid query string parameter",
			});
		}
		if (splitString[2] === "m") {
			multiplier = 60;
		} else if (splitString[2] === "h") {
			multiplier = 3600;
		} else {
			return Responses._400({
				message: "Invalid query string parameter",
			});
		}
		duration = num * multiplier;
	}

	var endTime = 0;

	if (duration) {
		endTime = Math.floor(Date.now() / 1000) - duration;
	}
	const params = {
		ExpressionAttributeValues: {
			":tagId": tagId,
			":endTime": endTime,
		},
		ExpressionAttributeNames: {
			"#t": "time",
		},
		KeyConditionExpression: "tagId = :tagId AND #t >= :endTime",
		ScanIndexForward: false,
		IndexName: "DateLocalIndex",
		TableName: process.env.sensorTable,
	};
	console.log("Params: ", params);

	var errMessage = "";

	const result = await Dynamo.query(params).catch((err) => {
		errMessage = err;
		console.error("Error thrown by Dynamo query:", err);
		return null;
	});

	if (!result) {
		return Responses._400({ message: errMessage });
	}

	return Responses._200({ result });
}
