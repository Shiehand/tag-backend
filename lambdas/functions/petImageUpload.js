"use strict";

import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
import * as fileType from "file-type";
const Responses = require("../common/API_Responses");

/**
 * Lambda function used to store an uploaded image from the web app to the S3 bucket
 * body must contain username, petName and image
 * body.image is a 64-bit encoded string of the image
 */
exports.handler = async (event) => {
	console.log(event);

	const s3 = new S3();

	try {
		const body = JSON.parse(event.body);
		console.log("Body: ", body);
		if (!body || !body.image || !body.username || !body.petName) {
			return Responses._400({ message: "incorrect body on request" });
		}

		const username = body.username;
		const petName = body.petName;
		let imageData = body.image;
		if (body.image.substr(0, 7) === "base64,") {
			imageData = body.image.substr(7, body.image.length);
		}

		const decodedImage = Buffer.from(imageData, "base64");
		const fileInfo = await fileType.fromBuffer(decodedImage);
		const fileExt = fileInfo.ext;
		// const detectedMime = fileInfo.mime;

		const name = uuid();
		const key = `pets/${username}/${name}.${fileExt}`;

		await s3
			.putObject({
				Body: decodedImage,
				Key: key,
				Bucket: process.env.imageUploadBucket,
				Metadata: {
					user: username,
					petName: petName,
				},
				ACL: "public-read",
			})
			.promise();

		const url = `https://${process.env.imageUploadBucket}.s3-${process.env.region}.amazonaws.com/${key}`;
		return Responses._200({ imageUrl: url });
	} catch (err) {
		console.log("Error:", err);
		return Responses._400({
			message: err.message || "failed to upload image",
		});
	}
};
