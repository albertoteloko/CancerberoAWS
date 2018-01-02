var AWS = require('aws-sdk');


var region = process.env.AWS_REGION;
var snsArn = process.env.SNS_ARN;

AWS.config.region = region;

exports.handler = function (event, context, callback) {
    console.log("Event", event);

    let deviceEvent = (event.body !== undefined) ? JSON.parse(event.body) : event;
    deviceEvent.id = context.invokeid;
    console.log("deviceEvent", deviceEvent);

    let validation = validateEvent(deviceEvent);

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
        let sns = new AWS.SNS();

        console.log("SNS event", deviceEvent);
        sns.publish({
            Message: JSON.stringify(deviceEvent),
            TopicArn: snsArn
        }, function (err, data) {
            if (err) {
                console.log(err.stack);
                callback(null, {
                    statusCode: '500',
                    body: JSON.stringify({'message': 'Unable tu publish'}),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                callback(null, {
                    statusCode: '200',
                    body: JSON.stringify({'eventId': deviceEvent.id}),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            }
        });
    }

    function validateEvent(event) {
        if (!validString(event.name)) {
            return "Missing/Invalid event param";
        } else if (!validString(event.deviceId)) {
            return "Missing/Invalid deviceId param";
        } else if (!validDate(event.timestamp)) {
            return "Missing/Invalid timestamp param";
        }

        if(event.name === "pin-change"){
            return validatePinChangeEvent(event);
        }
        return null;
    }

    function validatePinChangeEvent(event) {
        if (!validString(event.payload.pin)) {
            return "Missing/Invalid payload.pin param";
        } else if (!validBoolean(event.payload.value)) {
            return "Missing/Invalid payload.value param";
        }
        return null;
    }

    function validString(value) {
        return (value !== undefined) && (value !== null) && (value !== '');
    }
    function validDate(value) {
        return !isNaN(Date.parse(value));
    }

    function validBoolean(value) {
        return (value !== undefined) && (value !== null) && (typeof(value) === "boolean")
    }
};

