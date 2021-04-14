"use strict";
import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

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
