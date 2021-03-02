"use strict";

const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
	console.log(event);
	if (!event.pathParameters || !event.pathParameters.tagId) {
		return Responses._400({ message: "missing path parameters" });
	}

	var tagId = event.pathParameters.tagId;
	var duration;

	if (!event.queryStringParameters.t) {
		duration = 60 * 60;
	} else {
		let splitString = event.queryStringParameters.t.split(/(\d+)/);
		const multiplier = splitString[2] == "m" ? 60 : 3600;
		duration = parseInt(splitString[1]) * multiplier;
	}

	const endTime = Math.floor(Date.now() / 1000) - duration;

	const params = {
		ExpressionAttributeValues: {
			":tagId": tagId,
			":endTime": endTime,
		},
		KeyConditionExpression: "PK = :tagId and SK >= :endTime",
		TableName: process.env.sensorTable,
	};
	console.log(params);

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
};
