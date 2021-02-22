'use strict'
const Dynamo = require('../common/Dynamo');

exports.handler = (event, context, callback) => {
    console.log(event);
    const req = event.request;

    const params = {
        PK: `USER#${event.userName}`,
        SK: `USER#${event.userName}`,
        FirstName: req.userAttributes.given_name,
        LastName: req.userAttributes.family_name,
        Email: req.userAttributes.email,
    };

    var errMessage = '';

    const newUser = Dynamo.write(params, process.env.userTagTable).catch(err => {
        errMessage = err;
        console.error('Error thrown by Dynamo put:', err);
        return null;
    })

    callback(null, event);
}