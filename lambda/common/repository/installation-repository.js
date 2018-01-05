const AWS = require('aws-sdk');

const region = process.env.AWS_REGION;
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE = 'INSTALLATIONS';

AWS.config.region = region;

module.exports = {
    findInstallations: function () {
        console.log("Get all installations");

        let params = {
            TableName: TABLE
        };

        return docClient.scan(params).promise().then(item => {
            if (item.Items !== undefined) {
                return {"installations": item.Items};
            } else {
                return null
            }
        });
    },
    read: function (installationId) {
        console.log("Search installation with id: ", installationId);

        let params = {
            TableName: TABLE,
            Key: {
                "id": installationId,
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
    save: function (installation) {
        console.log("Savings installation: ", installation);

        let params = {
            TableName: TABLE,
            Item: installation
        };

        return docClient.put(params).promise().then(item => {
            return installation
        });
    }
};