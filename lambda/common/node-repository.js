const postgresql = require('postgresql');
const pinRepository = require('pin-repository');
const nodeStatusChangeEventRepository = require('node-status-change-event-repository');


module.exports = {
    findNodes() {
        // const query = client.query('SELECT * FROM NODES ORDER BY id ASC;');
        return Promise.resolve([]);
    },
    getNode: function (nodeId) {
        console.log("Search node with id: ", nodeId);
        const query = {
            text: 'SELECT * FROM NODES WHERE ID=$1',
            values: [nodeId],
        };

        const client = postgresql.createDBClient();
        client.connect();
        const nodePromise = client.query(query)
            .then(res => {
                client.end();

                if (res.rows.length === 0) {
                    console.log("No Result", nodeId);
                    return null;
                } else {
                    return res.rows[0];
                }
            });

        const pinsPromise = pinRepository.getNodePins(nodeId)
            .then(pins => {
                pins.forEach(n => delete n.node_id);
                return pins;
            });

        const statusPromise = nodeStatusChangeEventRepository.getLatestNodeStatus(nodeId);

        return Promise.all([nodePromise, pinsPromise, statusPromise])
            .then(values => {
                const node = values[0];
                const pins = values[1];
                const latestStatus = values[2];

                if (node != null) {
                    node.pins = pins;
                }

                if(latestStatus != null){
                    node.status = latestStatus;
                }else{
                    node.status = "Iddle";
                }

                return node;
            });
    }
};