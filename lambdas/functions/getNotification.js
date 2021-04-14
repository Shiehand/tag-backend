"use strict;";

import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

exports.handler = async (event) => {
	console.log("Event", event);
	if (!event.pathParameters || !event.pathParameters.username) {
		return Responses._400({ message: "missing path parameters" });
	}

	const username = event.pathParameters.username;

	const params = {
		ExpressionAttributeValues: {
			":username": username,
		},
		KeyConditionExpression: "username = :username",
		ScanIndexForward: false,
		TableName: process.env.notificationTable,
	};
	console.log("Params: ", params);

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
