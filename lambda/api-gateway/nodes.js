// const nodeRepository = require('node-repository');
// const validations = require('validations');


exports.handler = function (event, context, callback) {
    console.log("Event", event);

    callback(null, {
        statusCode: '200',
        body: JSON.stringify({"id": "asssss"}),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // if (isFindRequest(event)) {
    //     handleFind(event, context, callback);
    // } else if (isReadRequest(event)) {
    //     handleRead(event, context, callback);
    // } else {
    //     callback(null, {
    //         statusCode: '400',
    //         body: JSON.stringify({'message': "Unknown action"}),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });
    // }
    //
    // function isFindRequest(event) {
    //     return (event.resource === "/nodes") && (event.httpMethod === "GET");
    // }
    //
    // function isReadRequest(event) {
    //     return (event.resource === "/nodes/{id}") && (event.httpMethod === "GET");
    // }
    //
    // function handleFind(event, context, callback) {
    //     let nodes = nodeRepository.findNodes();
    //     callback(null, {
    //         statusCode: '200',
    //         body: JSON.stringify(nodes),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });
    // }
    //
    // function handleRead(event, context, callback) {
    //     let id = event.pathParameters.id;
    //
    //     if (validations.validString(id)) {
    //         nodeRepository.getNode(id)
    //             .then(node => {
    //                 if (node != null) {
    //                     callback(null, {
    //                         statusCode: '200',
    //                         body: JSON.stringify(node),
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                     });
    //                 } else {
    //                     callback(null, {
    //                         statusCode: '204',
    //                         body: JSON.stringify({'message': "Node not found with id: " + id}),
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                     });
    //                 }
    //             })
    //             .catch(e => {
    //                     callback(null, {
    //                         statusCode: '500',
    //                         body: JSON.stringify({'message': e.stack}),
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                     });
    //                 }
    //             );
    //     } else {
    //         callback(null, {
    //             statusCode: '400',
    //             body: JSON.stringify({'message': "Invalid id: " + id}),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //     }
    // }
};

