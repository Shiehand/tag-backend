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

	if (!body.image) {
		return Responses._400("missing image name");
	}
	const imageName = body.image;

	const filteredBody = Object.keys(body)
		.filter((key) => key != "tagId" && key != "image")
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

	const inputArr = [];
	inputArr.push(
		filteredBody.temperature,
		filteredBody.accel_x,
		filteredBody.accel_y,
		filteredBody.accel_z
	);
	const activity = await axios.post(
		"https://hvuhuknme2.execute-api.us-west-2.amazonaws.com/default/predict-image-activity",
		{
			accel: inputArr,
			image: imageName,
		}
	);
	console.log("Activity", activity.data);
	params.activity = activity.data.activity;
	params.poach = activity.data.poach;
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
