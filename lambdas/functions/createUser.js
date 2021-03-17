"use strict";
import Dynamo from "../common/Dynamo";

export async function handler(event) {
	console.log(event);
	const req = event.request;

	const params = {
		PK: `USER#${event.userName}`,
		SK: `USER#${event.userName}`,
		firstName: req.userAttributes.given_name,
		lastName: req.userAttributes.family_name,
		email: req.userAttributes.email,
	};

	try {
		await Dynamo.write(params, process.env.userTagTable);
	} catch (err) {
		console.error("Error thrown by Dynamo put:", err);
	}

	return event;
}
