"use strict";
import Dynamo from "../common/Dynamo";

export async function handler(event) {
	console.log(event);
	const req = event.request;

	const params = {
		PK: `USER#${event.userName}`,
		SK: `USER#${event.userName}`,
		FirstName: req.userAttributes.given_name,
		LastName: req.userAttributes.family_name,
		Email: req.userAttributes.email,
	};

	try {
		await Dynamo.write(params, process.env.userTagTable);
	} catch (err) {
		console.error("Error thrown by Dynamo put:", err);
	}

	return null;
}
