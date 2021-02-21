const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(Key, TableName) {
        const params = {
            TableName,
            Key
        }
        console.log("Parameters:", params);
        
        const res = await ddb.get(params).promise();

        if (!res || !res.Item) {
            console.log(res);
            throw Error(`There was an error fetching data for PK: ${Key.PK} and SK: ${Key.SK} from ${TableName}`);
        }
        return res.Item;
    },

    async write(data, TableName) {
        if (!data.PK || !data.SK) {
            throw Error('Key not found');
        };

        const params = {
            TableName,
            Item: data
        };

        const res = await ddb.put(params).promise();

        if (!res) {
            console.log(res);
            throw Error(`There was an error putting data for PK: ${data.PK} and SK: ${data.SK} in table ${TableName}`)
        }

        return data;
    }
}

module.exports = Dynamo;