var AWS = require('aws-sdk');
let alarmDefinitions = require('alarm-definitions');


var region = process.env.AWS_REGION;

AWS.config.region = region;

exports.handler = function (event, context, callback) {
    console.log("Event", event);

    let events = extractRecords(event);

    for (let event of events) {
        console.log("Record", event);
        handleEvent(event);
    }

    function extractRecords(event) {
        if (event.Records) {
            return event.Records.filter(r => (r.Sns !== undefined)).map(r => JSON.parse(r.Sns.Message));
        } else {
            return [event]
        }
    }


    function handleEvent(event) {
        let alarmDefinition = alarmDefinitions.findByDeviceId(event.deviceId);

        if (alarmDefinition !== null) {
            if (event.name === 'pin-change') {
                alarmDefinition.onPinChange(event.id, event.deviceId, event.payload.pin, event.payload.value, event.timestamp);
            }
        } else {
            console.error("Device", event.deviceId, "not found")
        }
    }
};
