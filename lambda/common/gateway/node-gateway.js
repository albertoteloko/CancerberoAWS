const AWS = require('aws-sdk');

const region = process.env.AWS_REGION;
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE = 'EVENTS';

AWS.config.region = region;

module.exports = {
    run: function (node, event) {
        console.log("Action in node " + node.id + ": ", event);

        return Promise.resolve("asd");
    }
};