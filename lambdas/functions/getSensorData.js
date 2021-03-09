"use strict";

import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

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
		if (splitString[2] === "m") {
			multiplier = 60;
		} else if (splitString[2] === "h") {
			multiplier = 3600;
		} else {
			return Responses._400({ message: "Invalid query string parameter" });
		}
		duration = parseInt(splitString[1]) * multiplier;
	}

	const endTime = 0;

	if (duration) {
		endTime = Math.floor(Date.now() / 1000) - duration;
	}
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
}
