const postgresql = require('postgresql');

module.exports = {
    getLatestNodeStatus: function (nodeId) {
        console.log("getLatestPinStatus: ", nodeId);
        const query = {
            text: 'SELECT STATUS FROM (SELECT STATUS, RANK() OVER (PARTITION BY NODE_ID ORDER BY TIMESTAMP DESC) FROM NODE_STATUS_CHANGE_EVENTS WHERE NODE_ID=$1) AS BASE WHERE RANK = 1;',
            values: [nodeId],
        };

        const client = postgresql.createDBClient();
        client.connect();
        return client.query(query)
            .then(res => {
                client.end();

                if (res.rows.length === 0) {
                    console.log("No Result", nodeId);
                    return null;
                } else {
                    return res.rows[0].status;
                }
            });
    },
    storeStatusChange: function (nodeId, value) {
        console.log("storeStatusChange: ", nodeId, value);
        const query = {
            text: 'INSERT INTO NODE_STATUS_CHANGE_EVENTS(NODE_ID, STATUS) VALUES($1, $2) RETURNING *',
            values: [nodeId, value],
        };

        const client = postgresql.createDBClient();
        client.connect();
        return client.query(query)
            .then(res => {
                client.end();

                if (res.rows.length === 0) {
                    console.log("Not saved", nodeId, value);
                    return null;
                } else {
                    const result= res.rows[0];
                    propertyRename(result, 'node_id', 'nodeId');
                    return result;
                }
            });
    }
};

function propertyRename(object, oldPropertyKey, newPropertyName){
    object[newPropertyName] = object[oldPropertyKey];
    delete object[oldPropertyKey];
}