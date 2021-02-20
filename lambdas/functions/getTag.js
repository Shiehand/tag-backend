'use strict'
const AWS = require('aws-sdk');

const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

AWS.config.update({ region: "us-west-1" });

exports.handler = async (event) => {
    if (!event.pathParameters || !event.pathParameters.username || !event.pathParameters.tagName) {
        return Responses._400({ message: 'missing path parameters' });
    }

    let username = event.pathParameters.username;
    let tagName = event.pathParameters.tagName;

    const params = {
        PK: username,
        SK: tagName,
    };

    const errMessage = '';

    const tag = await Dynamo.get(params, process.env.userTagTable).catch(err => {
        errMessage = err;
        console.error('Error thrown by Dynamo get:', err);
        return null;
    });

    if (!tag) {
        return Responses._400({ message: errMessage });
    } else {
        return Responses._200({ tag });
    }
}