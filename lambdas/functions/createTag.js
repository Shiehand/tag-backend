'use strict'
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
    if (!event.pathParameters || !event.pathParameters.username) {
        return Responses._400({ message: 'missing path parameters' });
    }

    let username = event.pathParameters.username;

    console.log("Header:", event.headers);

    const tag = JSON.parse(event.body);
    if (!tag.SK) {
        return Responses._400({ message: 'No sort key found'});
    }
    tag.PK = `USER#${username}`;

    var errMessage = '';

    const newTag = await Dynamo.write(tag, process.env.userTagTable).catch(err => {
        errMessage = err;
        console.error('Error thrown by Dynamo put:', err);
        return null;
    });

    if (!newTag) {
        return Responses._400({ message: errMessage });
    }
    return Responses._200({ newTag });
}