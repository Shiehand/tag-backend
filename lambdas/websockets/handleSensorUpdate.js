"use strict;";
import { ApiGatewayManagementApi } from "aws-sdk";
import Dynamo from "../common/Dynamo";

exports.handler = async (event) => {
	const records = event.Records.filter(
		(record) => record.eventName === "INSERT"
	);
	for (const record of records) {
		console.log(record.dynamodb);
		const tagId = record.dynamodb.Keys.tagId.S;
		let params = {
			TableName: process.env.userTagTable,
			IndexName: "ReverseLookupIndex",
			KeyConditionExpression: "SK = :sk",
			ExpressionAttributeValues: {
				":sk": `TAGID#${tagId}`,
			},
		};
		console.log(params);

		const userTag = await Dynamo.query(params);
		console.log("User Tag: ", userTag);
		if (userTag.Items.length === 0) {
			continue;
		}
		const username = userTag.Items[0].PK.slice(5);
		const petName = userTag.Items[0].petName;
		if (userTag.Items[0].geofence) {
			geofence = userTag.Items[0].geofence;
			console.log("Geofencing: ", geofence);
		}

		const param = {
			TableName: process.env.socketTable,
			IndexName: "UsernameIndex",
			KeyConditionExpression: "username = :username",
			ExpressionAttributeValues: {
				":username": username,
			},
		};
		console.log("Query params:", params);
		try {
			// Getting all connection with the same tagId
			const connections = await Dynamo.query(param);

			// Looping through connections
			for (var connection of connections.Items) {
				console.log("Connection:", connection);
				const newItem = record.dynamodb.NewImage;
				let websocket = createSocket(
					connection.domainName,
					connection.stage
				);
				const message = {
					type: "newData",
					body: newItem,
				};

				// Posting new sensor data
				const params = {
					Data: Buffer.from(JSON.stringify(message)),
					ConnectionId: connection.connectionId,
				};
				await websocket.postToConnection(params).promise();

				// Checking if there is anything to notify
				if (newItem.temperature.N > 40) {
					let payload = {
						header: "Extreme Temperature",
						temperature: newItem.temperature.N,
						time: Math.floor(Date.now() / 1000),
						tagId: newItem.tagId.S,
						petName: petName,
						username: username,
					};
					Dynamo.write(payload, process.env.notificationTable)
						.then((res) => console.log(res))
						.catch((err) => console.error(err));
					payload.type = "notification";
					let notifyParams = {
						Data: Buffer.from(JSON.stringify(payload)),
						ConnectionId: connection.connectionId,
					};
					await websocket.postToConnection(notifyParams).promise();
				}
				if (newItem.activity.S === "unusual") {
					let payload = {
						header: "Unusual Activity",
						time: Math.floor(Date.now() / 1000),
						tagId: newItem.tagId.S,
						petName: petName,
						username: username,
					};
					Dynamo.write(payload, process.env.notificationTable)
						.then((res) => console.log(res))
						.catch((err) => console.error(err));
					payload.type = "notification";
					let notifyParams = {
						Data: Buffer.from(JSON.stringify(payload)),
						ConnectionId: connection.connectionId,
					};
					await websocket.postToConnection(notifyParams).promise();
				}
				console.log("Post success at", connection.connectionId);
			}
		} catch (err) {
			console.error(err);
		}
	}
};

const createSocket = (domainName, stage) => {
	const endpoint = `${domainName}/${stage}`;
	return new ApiGatewayManagementApi({
		apiVersion: "2018-11-29",
		endpoint,
	});
};
