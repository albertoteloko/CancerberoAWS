const postgresql = require('postgresql');


module.exports = {
    getPin: function (nodeId, pinId) {
        console.log("Search pins node: ", nodeId, "pinId", pinId);
        const query = {
            text: 'SELECT * FROM PINS WHERE NODE_ID=$1 AND PIN_ID=$2',
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
                    return res.rows[0];
                }
            });
    },
    getNodePins: function (nodeId) {
        console.log("Search node pins with id: ", nodeId);
        const query = {
            text: 'SELECT * FROM PINS WHERE NODE_ID=$1',
            values: [nodeId],
        };

        const client = postgresql.createDBClient();
        client.connect();
        return client.query(query)
            .then(res => {
                client.end();
                res.rows.forEach(i => {
                    propertyRename(i, "pin_id", "id");
                });
                return res.rows;
            });
    }
};

function propertyRename(object, oldPropertyKey, newPropertyName){
    object[newPropertyName] = object[oldPropertyKey];
    delete object[oldPropertyKey];
}