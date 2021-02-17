'use strict'
const AWS = require('aws-sdk');

const Responses = require('../common/API_Responses')
const ddb = require('../common/Dynamo')

AWS.config.update({ region: "us-west-1" })

exports.handler = async (event) => {
    if (!event.pathParameters || !event.pathParameters.ID) {
        return Responses._400({ message: 'missing ID from path' })
    }

    let ID = event.pathParameters.ID

    const tag = await ddb.get(ID, 'tagsTable').catch(err => {
        console.error('Error thrown by Dynamo get', err);
        return null;
    });

    if (!tag) {
        return Responses._400({ message: 'Failed to get tag' });
    } else {
        return Responses._200({ tag });
    }
}