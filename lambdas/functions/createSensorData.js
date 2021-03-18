"use strict;";

import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";

export const handler = async (event) => {
	console.log(event);
	const body = JSON.parse(event.body);
	console.log(body);

	if (!body.tagId || !body.date) {
		return Responses._400({ message: "Missing tagId or date" });
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
		PK: body.tagId,
		SK: body.date,
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
