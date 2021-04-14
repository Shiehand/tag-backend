"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

/**
 * Lambda function used to update animal info on the table
 * Username must be a path parameter
 * tagId must be in the event.body alongside other attributes that are to be updated
 * Any existing attributes not found in body will stay the same
 */
export async function handler(event) {
	if (!event.pathParameters || !event.pathParameters.username) {
		return Responses._400({ message: "missing path parameters" });
	}
	const username = event.pathParameters.username;
	console.log("Event", JSON.stringify(event));

	const body = JSON.parse(event.body);
	if (!body.tagId) {
		return Responses._400("Missing tagId");
	}
	const tagId = body.tagId;
	delete body.tagId;
	body.PK = `USER#${username}`;
	body.SK = `TAGID#${tagId}`;
	console.log(body);
	const res = await Dynamo.update(process.env.userTagTable, body, "PK", "SK");
	return Responses._200({ message: res });
}
