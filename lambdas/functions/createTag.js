"use strict";
import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

export async function handler(event) {
	if (!event.pathParameters || !event.pathParameters.username) {
		return Responses._400({ message: "missing path parameters" });
	}

	let username = event.pathParameters.username;

	console.log("Event", JSON.stringify(event));

	const body = JSON.parse(event.body);
	if (!body.petName) {
		return Responses._400("Missing petName");
	}
	const cleanBody = Object.entries(body).reduce(
		(a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
		{}
	);
	console.log(cleanBody);

	const params = {
		PK: `USER#${username}`,
		SK: `PET#${body.petName}`,
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
