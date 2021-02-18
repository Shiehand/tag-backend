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

    const params = {
        tag_id: ID,
    }

    var errMessage = ''

    const tag = await ddb.get(params, process.env.tagTableName).catch(err => {
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