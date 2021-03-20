const randomLocation = require("random-location");
const uuid = require("uuid");
const axios = require("axios").default;

var args = process.argv.slice(2);
var tagId = "123";

var center = {
	latitude: 49.266162,
	longitude: -123.25117,
};

var activityArr = ["sleeping", "sitting", "walking", "running"];

console.log(`Generating ${args[0]} entry`);
for (let i = 0; i < args[0]; i++) {
	let coord = randomLocation.randomCirclePoint(center, 500);
	let heartRate = Math.floor(Math.random() * 10 + 90);
	let temp = Math.floor(Math.random() * 30 + 20);
	let activity = activityArr[Math.floor(Math.random() * 3)];
	let body = {
		latitude: coord.latitude,
		longitude: coord.longitude,
		temperature: temp,
		heartRate,
		activity,
		readingId: uuid.v4(),
		time: Math.floor(Date.now() / 1000),
	};
	console.log("Body: ", body);

	axios.post(
		`https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/tags/${tagId}/sensors`,
		{
			...body,
		}
	);
}
