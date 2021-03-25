const randomLocation = require("random-location");
const uuid = require("uuid");
const axios = require("axios").default;

/**
 * This program will generate dummy sensor readings and post it to the sensor-reading table
 * To use this program call 'node populateSensor.js arg' where arg is an integer specifying the number of reading that will be generated
 */
var args = process.argv.slice(2);
var tagId = "123";

var center = {
	latitude: 49.266162,
	longitude: -123.25117,
};

// From https://stackoverflow.com/a/31379050
function randomDate(start, end, startHour, endHour) {
	var date = new Date(+start + Math.random() * (end - start));
	var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
	date.setHours(hour);
	return date;
}

var activityArr = ["sleeping", "sitting", "walking", "running"];

console.log(`Generating ${args[0]} entry`);
for (let i = 0; i < args[0]; i++) {
	let coord = randomLocation.randomCirclePoint(center, 500);
	let heartRate = Math.floor(Math.random() * 10 + 90);
	let temp = Math.floor(Math.random() * 30 + 20);
	let activity = activityArr[Math.floor(Math.random() * 3)];
	let time = randomDate(new Date(2021, 3, 1), new Date(), 0, 23);
	let body = {
		latitude: coord.latitude,
		longitude: coord.longitude,
		temperature: temp,
		heartRate,
		activity,
		readingId: uuid.v4(),
		time: Math.floor(time.getTime() / 1000),
	};
	console.log("Body: ", body);

	axios.post(
		`https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/tags/${tagId}/sensors`,
		{
			...body,
		}
	);
}
