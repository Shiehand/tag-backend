"use strict";
const Dynamo = require("../common/Dynamo");

/**
 * Lambda function triggered by a successful registration of a new user
 * This function will create a corresponding user entry in the user-tag table
 */
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
	console.log("Params: ", params);

	try {
		await Dynamo.write(params, process.env.userTagTable);
	} catch (err) {
		console.error("Error thrown by Dynamo put:", err);
	}

	return event;
}
