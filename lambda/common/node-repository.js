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

// console.log("Search node with id: ", nodeId);
// const query = {
//     text: 'SELECT * FROM NODES WHERE ID=$1',
//     values: [nodeId],
// };
//
// const client = postgresql.createDBClient();
// client.connect();
// const nodePromise = client.query(query)
//     .then(res => {
//         client.end();
//
//         if (res.rows.length === 0) {
//             console.log("No Result", nodeId);
//             return null;
//         } else {
//             return res.rows[0];
//         }
//     });
//
// const pinsPromise = pinRepository.getNodePins(nodeId)
//     .then(pins => {
//         pins.forEach(n => delete n.node_id);
//         return pins;
//     });
//
// const statusPromise = nodeStatusChangeEventRepository.getLatestNodeStatus(nodeId);
//
// return Promise.all([nodePromise, pinsPromise, statusPromise])
//     .then(values => {
//         const node = values[0];
//         const pins = values[1];
//         const latestStatus = values[2];
//
//         if (node != null) {
//             node.pins = pins;
//         }
//
//         if(latestStatus != null){
//             node.status = latestStatus;
//         }else{
//             node.status = "Iddle";
//         }
//
//         return node;
//     });