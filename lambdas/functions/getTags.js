'use strict'
const AWS = require('aws-sdk');
const Responses = require('../common/API_Responses')

AWS.config.update({ region: "us-west-1" })

exports.handler = async (event) => {
    console.log("Function start")
    const ddb = new AWS.DynamoDB.DocumentClient()

    console.log('event', event)

    if (!event.pathParameters || !event.pathParameters.ID) {
        return Responses._400({ message: 'missing ID from path' })
    }

    let ID = event.pathParameters.ID

    const params = {
        TableName: 'tagsTable',
        Key: {
            tagId: ID,
        }
    }

    const data = await ddb.get(params).promise()

    if (!data || !data.Item) {
        console.error("Error data empty")
        return Responses._400({ message: "error reading database" })
    } else {
        console.log(data)
        const user = data.Item
        return Responses._200({ user })
    }

}