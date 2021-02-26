'use strict'

const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
    console.log(event);

    if (!event.pathParameters || !event.pathParameters.username) {
        return Responses._400({ message: 'missing path parameters' });
    };

    var username = event.pathParameters.username;
    var petName = event.pathParameters.petName;
    if (!event.pathParameters.petName) {
        petName = '';
    };

    const params = {
        ExpressionAttributeValues: {
            ':pk': `USER#${username}`,
            ':sk': `PET#${petName}`,
        },
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        TableName: process.env.userTagTable,
    };

    var errMessage = '';

    const result = await Dynamo.query(params).catch(err => {
        errMessage = err;
        console.error('Error thrown by Dynamo query:', err);
        return null;
    });

    if (!result) {
        return Responses._400({ message: errMessage });
    };

    return Responses._200({ result });
}