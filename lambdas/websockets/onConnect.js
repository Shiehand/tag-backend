"use strict";
import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

/**
 * Lambda functions called when establishing new websocket connection
 */
exports.handler = async (event) => {
	console.log("Event", event);

	const { connectionId, domainName, stage } = event.requestContext;
	const username = event.queryStringParameters.username;

	if (!username) {
		return Responses._400({ message: "No username found" });
	}

	const data = {
		connectionId: connectionId,
		date: Math.floor(Date.now() / 1000),
		username: username,
		domainName: domainName,
		stage: stage,
		expDate: Math.floor(Date.now() / 1000) + 3600,
	};

	try {
		await Dynamo.write(data, process.env.socketTable);
	} catch (err) {
		console.log(err);
		return Responses._400({ message: err });
	}
	return Responses._200({ message: "Connected" });
};
