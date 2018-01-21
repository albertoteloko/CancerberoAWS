const AWS = require('aws-sdk');

const region = process.env.AWS_REGION;
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE = 'EVENTS';

AWS.config.region = region;

module.exports = {
    run: function (node, event) {
        console.log("Action on " + node.id + ": ", event);

        return Promise.resolve("done")

        // let params = {
        //     TableName: TABLE,
        //     Key: {
        //         "id": eventId,
        //     }
        // };
        //
        // return docClient.get(params).promise().then(item => {
        //     if (item.Item !== undefined) {
        //         return item.Item;
        //     } else {
        //         return null
        //     }
        // });
    }
    // save: function (event) {
    //     console.log("Savings event: ", event);
    //
    //     let params = {
    //         TableName:TABLE,
    //         Item: event
    //     };
    //
    //     return docClient.put(params).promise().then(item => {
    //             return event
    //     });
    // }
};