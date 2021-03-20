"use strict;";

import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

export const handler = async (event) => {
	console.log(event);
	const body = JSON.parse(event.body);
	console.log(body);

	const tagId = event.pathParameters.tagId;

	if (!body.readingId) {
		return Responses._400({ message: "Missing readingId" });
	}

	const filteredBody = Object.keys(body)
		.filter((key) => key != "tagId" && key != "date")
		.reduce((obj, key) => {
			return {
				...obj,
				[key]: body[key],
			};
		}, {});

	const params = {
		tagId: tagId,
		...filteredBody,
	};
	console.log("Params: ", params);
	try {
		const res = await Dynamo.write(params, process.env.sensorTable);
		console.log(res);
		return Responses._200({ data: res });
	} catch (err) {
		console.log(err);
		return Responses._400({ message: err });
	}
};
