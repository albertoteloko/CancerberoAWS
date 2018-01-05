const AWS = require('aws-sdk');

const region = process.env.AWS_REGION;
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE = 'EVENTS';

AWS.config.region = region;

module.exports = {
    read: function (eventId) {
        console.log("Search event with id: ", eventId);

        let params = {
            TableName: TABLE,
            Key: {
                "id": eventId,
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
    save: function (event) {
        console.log("Savings event: ", event);

        let params = {
            TableName:TABLE,
            Item: event
        };

        return docClient.put(params).promise().then(item => {
                return event
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