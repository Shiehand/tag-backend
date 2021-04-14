"use strict;";
import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

/**
 * Lambda function called after a websocket connection is closed
 */
exports.handler = async (event) => {
	console.log("Event", event);

	const { connectionId } = event.requestContext;
	const key = {
		connectionId: connectionId,
	};

	try {
		await Dynamo.delete(key, process.env.socketTable);
	} catch (err) {
		console.log(err);
		return Responses._400({ message: err });
	}
	return Responses._200({ message: "Disconnected" });
};
