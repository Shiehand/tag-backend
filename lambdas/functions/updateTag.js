"use strict";
import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

export async function handler(event) {
	if (!event.pathParameters || !event.pathParameters.username) {
		return Responses._400({ message: "missing path parameters" });
	}
	const username = event.pathParameters.username;
	console.log("Event", JSON.stringify(event));

	const body = JSON.parse(event.body);
	if (!body.petName) {
		return Responses._400("Missing petName");
	}
	const petName = body.petName;
	delete body.petName;
	body.PK = `USER#${username}`;
	body.SK = `PET#${petName}`;
	console.log(body);
	const res = await Dynamo.update(process.env.userTagTable, body, "PK", "SK");
	return Responses._200({ message: res });
}
