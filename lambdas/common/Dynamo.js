/**
 * Based on https://github.com/SamWSoftware/ServerlessYoutubeSeries/tree/l45-debugging
 */
const AWS = require("aws-sdk");

const isTest = process.env.JEST_WORKER_ID;
const config = {
	convertEmptyValues: true,
	...(isTest && {
		endpoint: "localhost:8000",
		sslEnabled: false,
		region: "local-env",
	}),
};

const ddb = new AWS.DynamoDB.DocumentClient(config);

const Dynamo = {
	/**
	 * Get an item with Key in TableName
	 * @param {object} Key the key(s) of the item
	 * @param {string} TableName name of the table the item is located
	 * @returns the item if it exists
	 */
	async get(Key, TableName) {
		const params = {
			TableName,
			Key,
		};

		const res = await ddb.get(params).promise();

		if (!res || !res.Item) {
			console.log(res);
			throw Error(
				`There was an error fetching data for key: ${JSON.stringify(
					Key,
					null,
					2
				)} from ${TableName}`
			);
		}
		return res.Item;
	},

	/**
	 * Write a new item consisting of data to TableName
	 * @param {object} data the item attributes
	 * @param {string} TableName the name of table to be written into
	 * @returns data if successful
	 */
	async write(data, TableName) {
		const params = {
			TableName,
			Item: data,
		};
		const res = await ddb.put(params).promise();

		if (!res) {
			console.log(res);
			throw Error(
				`There was an error putting data for PK: ${data.PK} and SK: ${data.SK} in table ${TableName}`
			);
		}

		return data;
	},

	/**
	 * Wrapper function for dynamodb query
	 * @param {object} params the same params as dynamodbdocclient query
	 * @returns the item(s) queried if successfull
	 */
	async query(params) {
		if (!params.TableName) {
			throw Error("No table name found");
		}

		const res = await ddb.query(params).promise();

		if (!res) {
			console.log(res);
			throw Error(`Error querying in table ${params.TableName}`);
		}

		return res.Items;
	},

	/**
	 * Deletes an item from a table
	 * @param {object} key the key(s) of the item to be deleted
	 * @param {string} tableName name of the table the item is located
	 */
	async delete(key, tableName) {
		const params = {
			Key: {
				...key,
			},
			TableName: tableName,
		};

		try {
			await ddb.delete(params).promise();
		} catch (err) {
			console.log(err);
			throw Error(`Error deleting ${pk}`);
		}
	},

	/**
	 * Update an item in a table
	 * Some parts based from https://stackoverflow.com/a/63511693
	 * @param {string} tableName name of the table
	 * @param {object} item the updated item
	 * @param {string} partitionKey name of the PK
	 * @param {string} sortKey name of the SK
	 * @returns {object} attributes that are updated
	 */
	async update(tableName, item, partitionKey, sortKey = null) {
		var params = {
			TableName: tableName,
			Key: {},
			ExpressionAttributeValues: {},
			ExpressionAttributeNames: {},
			UpdateExpression: "",
			ReturnValues: "UPDATED_NEW",
		};

		params["Key"][partitionKey] = item[partitionKey];
		if (sortKey) {
			params["Key"][sortKey] = item[sortKey];
		}

		let prefix = "set ";
		let attributes = Object.keys(item);
		for (let i = 0; i < attributes.length; i++) {
			let attribute = attributes[i];
			if (attribute != partitionKey && attribute != sortKey) {
				params["UpdateExpression"] +=
					prefix + "#" + attribute + " = :" + attribute;
				params["ExpressionAttributeValues"][":" + attribute] =
					item[attribute];
				params["ExpressionAttributeNames"]["#" + attribute] = attribute;
				prefix = ", ";
			}
		}
		try {
			const res = await ddb.update(params).promise();
			return res.Attributes;
		} catch (error) {
			console.error(error);
			throw Error(`Error updating ${partitionKey}`);
		}
	},
};

module.exports = Dynamo;
