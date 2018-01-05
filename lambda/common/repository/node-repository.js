const AWS = require('aws-sdk');

const region = process.env.AWS_REGION;
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE = 'NODES';

AWS.config.region = region;

module.exports = {
    findNodes: function () {
        console.log("Get all nodes");

        let params = {
            TableName: TABLE
        };

        return docClient.scan(params).promise().then(item => {
            if (item.Items !== undefined) {
                return {"nodes": item.Items};
            } else {
                return null
            }
        });
    },
    read: function (nodeId) {
        console.log("Search node with id: ", nodeId);

        let params = {
            TableName: TABLE,
            Key: {
                "id": nodeId,
            }
        };

        return docClient.get(params).promise().then(item => {
            if (item.Item !== undefined) {
                return item.Item;
            } else {
                return null
            }
        });
    },
    save: function (node) {
        console.log("Savings node: ", node);

        let params = {
            TableName: TABLE,
            Item: node
        };

        return docClient.put(params).promise().then(item => {
            return node
        });
    }
};