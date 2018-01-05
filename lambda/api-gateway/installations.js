const nodeRepository = require('repository/node-repository');
const installationRepository = require('repository/installation-repository');
const validations = require('validations');


exports.handler = function (event, context, callback) {
    console.log("Input", event);
    console.log("Context", context);

    if (isFindRequest(event)) {
        handleFind(event, context, callback);
    } else if (isReadRequest(event)) {
        handleRead(event, context, callback);
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
        return (event.resource === "/installations") && (event.httpMethod === "GET");
    }

    function isReadRequest(event) {
        return (event.resource === "/installations/{id}") && (event.httpMethod === "GET");
    }

    function handleFind(event, context, callback) {
        installationRepository.findInstallations()
            .then(installations => {
                if (installations != null) {
                    callback(null, {
                        statusCode: '200',
                        body: JSON.stringify(installations),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } else {
                    callback(null, {
                        statusCode: '204',
                        body: JSON.stringify({'message': "Installations not found"}),
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
            installationRepository.read(id)
                .then(installation => {
                    if (installation != null) {
                        callback(null, {
                            statusCode: '200',
                            body: JSON.stringify(installation),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    } else {
                        callback(null, {
                            statusCode: '204',
                            body: JSON.stringify({'message': "Installation not found with id: " + id}),
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
};

