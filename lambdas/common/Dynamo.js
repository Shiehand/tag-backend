/**
 * Based on https://github.com/SamWSoftware/ServerlessYoutubeSeries/tree/l45-debugging
 */
import { DynamoDB } from "aws-sdk";

const ddb = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const Dynamo = {
	/*
	 * Function to get an item with Key from TableName
	 * Params:
	 *  Key: PK (or SK) of the item
	 *  TableName: Name of the table the item is located
	 */
	async get(Key, TableName) {
		const params = {
			TableName,
			Key,
		};
		console.log("Parameters:", params);

		const res = await ddb.get(params).promise();

		if (!res || !res.Item) {
			console.log(res);
			throw Error(
				`There was an error fetching data for PK: ${Key.PK} and SK: ${Key.SK} from ${TableName}`
			);
		}
		return res.Item;
	},

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

	async query(params) {
		if (!params.TableName) {
			throw Error("No table name found");
		}

		const res = await ddb.query(params).promise();

		if (!res) {
			console.log(res);
			throw Error(`Error querying in table ${params.TableName}`);
		}

		return res;
	},

	async delete(key, tableName) {
		const params = {
			Key: {
				...key,
			},
			TableName: tableName,
		};

		console.log(params);

		try {
			await ddb.delete(params).promise();
		} catch (err) {
			console.log(err);
			throw Error(`Error deleting ${pk}`);
		}
	},
};

export default Dynamo;
