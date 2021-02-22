'use strict'
const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

exports.handler = async (event) => {
    if (!event.pathParameters || !event.pathParameters.username || !event.pathParameters.tagName) {
        return Responses._400({ message: 'missing path parameters' });
    }

    let username = event.pathParameters.username;
    let tagName = event.pathParameters.tagName;

    const params = {
        PK: `USER#${username}`,
        SK: `PET#${tagName}`,
    };

    var errMessage = '';

    const tag = await Dynamo.get(params, process.env.userTagTable).catch(err => {
        errMessage = err.message;
        console.error('Error thrown by Dynamo get:', err);
        return null;
    });

    if (!tag) {
        return Responses._400({ message: errMessage });
    } else {
        return Responses._200({ tag });
    }
}