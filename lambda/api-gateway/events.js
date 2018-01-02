const AWS = require('aws-sdk');
const validations = require('validations');
const eventService = require('events-service');


const region = process.env.AWS_REGION;

AWS.config.region = region;

exports.handler = function (event, context, callback) {
    console.log("Event", event);

    let deviceEvent = (event.body !== undefined) ? JSON.parse(event.body) : event;
    console.log("deviceEvent", deviceEvent);

    let validation = validations.validateEvent(deviceEvent);

    if (validation !== null) {
        console.info("Invalid request: ", validation);
        callback(null, {
            statusCode: '400',
            body: JSON.stringify({'message': validation, 'event': deviceEvent}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {

        console.log("Event", deviceEvent);
        eventService.handle(deviceEvent).then(event => {
            callback(null, {
                statusCode: '200',
                body: JSON.stringify(event),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }, message => {
            callback(null, {
                statusCode: '412',
                body: JSON.stringify({'message': message}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
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
};

