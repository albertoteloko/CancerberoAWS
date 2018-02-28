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
    },
    updatePing: function (nodeId, timestamp) {
        console.log("Savings node ping: ", nodeId, timestamp);

        let params = {
            TableName: TABLE,
            Key: {
                "id": nodeId
            },
            UpdateExpression: "set lastPing = :p",
            ExpressionAttributeValues: {
                ":p": timestamp
            },
            ReturnValues: "UPDATED_NEW"
        };

        return docClient.update(params).promise();
    },
    updateAlarmStatus: function (nodeId, value, source, timestamp) {
        console.log("Savings node status: ", nodeId, value, source, timestamp);

        let params = {
            TableName: TABLE,
            Key: {
                "id": nodeId
            },
            UpdateExpression: "set modules.alarm.#S = :s",
            ExpressionAttributeValues: {
                ":s": {
                    'value': value,
                    'source': source,
                    'timestamp': timestamp
                }
            },
            ExpressionAttributeNames: {
                '#S': "status",
            },
            ReturnValues: "UPDATED_NEW"
        };

        return docClient.update(params).promise();
    },
    setPinReading: function (nodeId, pinId, value, timestamp) {
        console.log("Savings node pin reading: ", nodeId, pinId, value, timestamp);

        let params = {
            TableName: TABLE,
            Key: {
                "id": nodeId
            },
            UpdateExpression: "set modules.alarm.pins.#PI.readings = :s",
            ExpressionAttributeValues: {
                ":s": {
                    'value': value,
                    'timestamp': timestamp
                }
            },
            ExpressionAttributeNames: {
                '#PI': pinId
            },
            ReturnValues: "UPDATED_NEW"
        };

        return docClient.update(params).promise();
    },
    setPinActivated: function (nodeId, pinId, value, timestamp) {
        console.log("Savings node pin activating: ", nodeId, pinId, value, timestamp);

        let params = {
            TableName: TABLE,
            Key: {
                "id": nodeId
            },
            UpdateExpression: "set modules.alarm.pins.#PI.readings = :s, modules.alarm.pins.#PI.activations = :s",
            ExpressionAttributeValues: {
                ":s": {
                    'value': value,
                    'timestamp': timestamp
                }
            },
            ExpressionAttributeNames: {
                '#PI': pinId
            },
            ReturnValues: "UPDATED_NEW"
        };

        return docClient.update(params).promise();
    }
};