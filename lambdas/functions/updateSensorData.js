"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

/**
 * Lambda function used to update a sensor data entry on the table
 * event.body must have tagId and readingId
 * Attributes that are to be updated is included in event.body
 * Any existing attributes not found in body will stay the same
 */
export async function handler(event) {
	console.log("Event", JSON.stringify(event));

	const body = JSON.parse(event.body);
	console.log("Body", body);
	if (!body.tagId || !body.readingId) {
		return Responses._400("Missing tagId or readingId");
	}
	console.log(body);
	const res = await Dynamo.update(
		process.env.sensorTable,
		body,
		"tagId",
		"readingId"
	);
	return Responses._200({ message: res });
}
