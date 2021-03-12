"use strict;";
import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

exports.handler = async (event) => {
	console.log("Event", event);

	const { connectionId } = event.requestContext;
	const key = {
		ConnectionId: connectionId,
	};

	try {
		await Dynamo.delete(key, process.env.socketTable);
	} catch (err) {
		console.log(err);
		return Responses._400({ message: err });
	}
	return Responses._200({ message: "Disconnected" });
};
