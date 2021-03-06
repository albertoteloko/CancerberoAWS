const nodeRepository = require('repository/node-repository');
const nodeGateway = require('gateway/node-gateway');
const validations = require('validations');
const base64 = require('Base64');

function parseJWT(token) {
    try {
        return JSON.parse(base64.atob(token.split('.')[1]));
    } catch (e) {
        console.log("raw token error", e);
        return null;
    }
}

exports.handler = function (event, context, callback) {
    console.log("Event", event);

    if (isFindRequest(event)) {
        handleFind(event, context, callback);
    } else if (isReadRequest(event)) {
        handleRead(event, context, callback);
    } else if (isActionRequest(event)) {
        handleAction(event, context, callback);
    } else {
        callback(null, {
            statusCode: '400',
            body: JSON.stringify({'message': "Unknown action"}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    function isFindRequest(event) {
        return (event.resource === "/nodes") && (event.httpMethod === "GET");
    }

    function isReadRequest(event) {
        return (event.resource === "/nodes/{id}") && (event.httpMethod === "GET");
    }

    function isActionRequest(event) {
        return (event.resource === "/nodes/{id}/actions") && (event.httpMethod === "POST");
    }

    function handleFind(event, context, callback) {
        nodeRepository.findNodes()
            .then(nodes => {
                if (nodes != null) {
                    callback(null, {
                        statusCode: '200',
                        body: JSON.stringify(nodes),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } else {
                    callback(null, {
                        statusCode: '204',
                        body: JSON.stringify({'message': "Nodes not found"}),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
            })
            .catch(e => {
                    callback(null, {
                        statusCode: '500',
                        body: JSON.stringify({'message': e.stack}),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
            );
    }

    function handleRead(event, context, callback) {
        let id = event.pathParameters.id;

        if (validations.validString(id)) {
            nodeRepository.read(id)
                .then(node => {
                    if (node != null) {
                        callback(null, {
                            statusCode: '200',
                            body: JSON.stringify(node),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    } else {
                        callback(null, {
                            statusCode: '204',
                            body: JSON.stringify({'message': "Node not found with id: " + id}),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    }
                })
                .catch(e => {
                        callback(null, {
                            statusCode: '500',
                            body: JSON.stringify({'message': e.stack}),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    }
                );
        } else {
            callback(null, {
                statusCode: '400',
                body: JSON.stringify({'message': "Invalid id: " + id}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    }

    function handleAction(event, context, callback) {
        let id = event.pathParameters.id;

        const token = parseJWT(event.headers['Authorization']);
        console.log("Token", token);

        if (validations.validString(id)) {
            nodeRepository.read(id)
                .then(node => {
                    if (node != null) {
                        console.info("Event body", event);
                        let action = (event.body !== undefined) ? JSON.parse(event.body) : event;
                        console.info("Input action", action);
                        action.timestamp = new Date().toString();
                        nodeGateway.run(node, action, "U:" + token.email)
                            .then(result => {
                                callback(null, {
                                    statusCode: '200',
                                    body: JSON.stringify(result),
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });
                            })
                            .catch(e => {
                                    console.error("Error in action", e);
                                    callback(null, {
                                        statusCode: e.code ? e.code : 500,
                                        body: JSON.stringify({'message': e.message ? e.message : e}),
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                }
                            );
                    } else {
                        callback(null, {
                            statusCode: '204',
                            body: JSON.stringify({'message': "Node not found with id: " + id}),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    }
                })
                .catch(e => {
                        console.error("General action", e);
                        callback(null, {
                            statusCode: '500',
                            body: JSON.stringify({'message': e.stack}),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    }
                );
        } else {
            callback(null, {
                statusCode: '400',
                body: JSON.stringify({'message': "Invalid id: " + id}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    }
};

