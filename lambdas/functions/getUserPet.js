"use strict";

const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

/**
 * Lambda function to get an animal entry from the table
 * username and tagId must be a path parameter
 */
export async function handler(event) {
	console.log(event);

	if (!event.pathParameters || !event.pathParameters.username) {
		return Responses._400({ message: "missing path parameters" });
	}

	var username = event.pathParameters.username;
	var tagId = event.pathParameters.tagId;
	if (!event.pathParameters.tagId) {
		tagId = "";
	}

	const params = {
		ExpressionAttributeValues: {
			":pk": `USER#${username}`,
			":sk": `TAGID#${tagId}`,
		},
		KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
		TableName: process.env.userTagTable,
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
