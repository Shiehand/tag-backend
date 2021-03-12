"use strict";
import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

exports.handler = async (event) => {
	console.log("Event", event);

	const { connectionId, domainName, stage } = event.requestContext;
	const tagId = event.queryStringParameters.tagId;

	if (!tagId) {
		return Responses._400({ message: "No tagId found" });
	}

	const data = {
		ConnectionId: connectionId,
		Date: Math.floor(Date.now() / 1000),
		TagId: tagId,
		DomainName: domainName,
		Stage: stage,
	};

	try {
		await Dynamo.write(data, process.env.socketTable);
	} catch (err) {
		console.log(err);
		return Responses._400({ message: err });
	}
	return Responses._200({ message: "Connected" });
};
