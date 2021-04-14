"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

/**
 * Lambda function to create a new animal/tag
 * username should be a path parameter
 * event.body should contain tagId and the rest of the attributes
 */
export async function handler(event) {
	if (!event.pathParameters || !event.pathParameters.username) {
		return Responses._400({ message: "missing path parameters" });
	}

	let username = event.pathParameters.username;

	console.log("Event", JSON.stringify(event));

	const body = JSON.parse(event.body);
	if (!body.tagId) {
		return Responses._400("Missing tagId");
	}
	const cleanBody = Object.entries(body).reduce(
		(a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
		{}
	);
	console.log(cleanBody);

	const params = {
		PK: `USER#${username}`,
		SK: `TAGID#${body.tagId}`,
		...cleanBody,
	};
	console.log("Params", params);

	var errMessage = "";

	const newTag = await Dynamo.write(params, process.env.userTagTable).catch(
		(err) => {
			errMessage = err;
			console.error("Error thrown by Dynamo put:", err);
			return null;
		}
	);

	if (!newTag) {
		return Responses._400({ message: errMessage });
	}
	return Responses._200({ newTag });
}
