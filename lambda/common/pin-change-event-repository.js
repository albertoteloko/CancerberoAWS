const postgresql = require('postgresql');

module.exports = {
    getLatestPinStatus: function (nodeId, pinId) {
        console.log("getLatestPinStatus: ", nodeId, pinId);
        const query = {
            text: 'SELECT VALUE FROM (SELECT VALUE, RANK() OVER (PARTITION BY NODE_ID, PIN_ID ORDER BY TIMESTAMP DESC) FROM PIN_VALUE_CHANGE_EVENTS WHERE NODE_ID=$1 AND PIN_ID=$2) AS BASE WHERE RANK = 1;',
            values: [nodeId, pinId],
        };

        const client = postgresql.createDBClient();
        client.connect();
        return client.query(query)
            .then(res => {
                client.end();

                if (res.rows.length === 0) {
                    console.log("No Result", nodeId, "pinId", pinId);
                    return null;
                } else {
                    return res.rows[0].value;
                }
            });
    },
    storePinChange: function (nodeId, pinId, value) {
        console.log("storePinChange: ", nodeId, pinId, value);
        const query = {
            text: 'INSERT INTO PIN_VALUE_CHANGE_EVENTS(NODE_ID, PIN_ID, VALUE) VALUES($1, $2, $3) RETURNING *',
            values: [nodeId, pinId, value],
        };

        const client = postgresql.createDBClient();
        client.connect();
        return client.query(query)
            .then(res => {
                client.end();

                if (res.rows.length === 0) {
                    console.log("Not saved", nodeId, pinId, value);
                    return null;
                } else {
                    const result= res.rows[0];
                    propertyRename(result, 'node_id', 'nodeId');
                    propertyRename(result, 'pin_id', 'pinId');
                    return result;
                }
            });
    }
};

function propertyRename(object, oldPropertyKey, newPropertyName){
    object[newPropertyName] = object[oldPropertyKey];
    delete object[oldPropertyKey];
}