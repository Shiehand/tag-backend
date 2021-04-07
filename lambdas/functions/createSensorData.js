"use strict;";

import Responses from "../common/API_Responses";
import Dynamo from "../common/Dynamo";
const axios = require("axios").default;

export const handler = async (event) => {
	console.log(event);
	const body = JSON.parse(event.body);
	console.log(body);

	const tagId = event.pathParameters.tagId;

	if (!body.readingId) {
		return Responses._400({ message: "Missing readingId" });
	}

	const filteredBody = Object.keys(body)
		.filter((key) => key != "tagId")
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

	if (filteredBody.accel_x && filteredBody.accel_y && filteredBody.accel_z) {
		const inputArr = [];
		inputArr.push(
			filteredBody.temperature,
			filteredBody.accel_x,
			filteredBody.accel_y,
			filteredBody.accel_z
		);
		const activity = await axios.post(
			"https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/predict",
			{
				input: inputArr,
			}
		);
		console.log("Activity", activity.data);
		params.activity = activity.data.prediction;
	}
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
