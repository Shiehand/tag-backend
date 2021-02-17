const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(tagId, TableName) {
        const params = {
            TableName,
            Key: {
                tagId,
            },
        }
        console.log(params);
        
        const data = await ddb.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching data for ID = ${ID} from ${TableName}`);
        }

        return data.Item;
    }
}

module.exports = Dynamo;