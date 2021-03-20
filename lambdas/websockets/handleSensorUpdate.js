"use strict;";
import { ApiGatewayManagementApi } from "aws-sdk";
import Dynamo from "../common/Dynamo";

exports.handler = async (event) => {
	console.log("Event", event);

	const idSet = new Set();
	const records = event.Records.filter(
		(record) => record.eventName === "INSERT"
	);
	for (const record of records) {
		const tagId = record.dynamodb.Keys.PK.S;
		if (idSet.has(tagId)) {
			return;
		}
		idSet.add(tagId);
		const params = {
			TableName: process.env.socketTable,
			IndexName: "TagIdIndex",
			KeyConditionExpression: "tagId = :tagId",
			ExpressionAttributeValues: {
				":tagId": tagId,
			},
		};
		console.log("Query params:", params);
		try {
			const connections = await Dynamo.query(params);
			console.log("Connection:", connections);
			for (var connection of connections.Items) {
				console.log(connection);
				let websocket = createSocket(
					connection.domainName,
					connection.stage
				);
				const params = {
					Data: "New sensor reading",
					ConnectionId: connection.connectionId,
				};
				await websocket.postToConnection(params).promise();
				console.log("Post success at", connection.connectionId);
			}
		} catch (err) {
			console.log(err);
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
