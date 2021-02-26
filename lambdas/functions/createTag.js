"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
	if (!event.pathParameters || !event.pathParameters.username) {
		return Responses._400({ message: "missing path parameters" });
	}

	let username = event.pathParameters.username;

	console.log("Header:", event.headers);

	const body = JSON.parse(event.body);

	const params = {
		PK: `USER#${username}`,
		SK: `PET#${body.petName}`,
		PetName: body.petName,
	};

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
};
