const AWS = require('aws-sdk');
const eventService = require('events-service');
const region = process.env.AWS_REGION;

AWS.config.region = region;

exports.handler = function (event, context, callback) {
    console.log("Event", event);
    event.Records.forEach(function (record) {
        let event = extractJson(record);
        if (record.eventName === 'INSERT') {
            console.info("Incoming event", event);
            eventService.handle(event).then(result => {
                console.info("Processed event", result, event);
            }, message => {
                console.error("Unable to process event", message, event);
            })
        } else {
            console.error("Unexpected record event type", record.eventName, event);
        }
        console.log('DynamoDB Record', record.dynamodb);
    });
    callback(null, "message");
};

function extractJson(record) {
    let result = {};
    console.log('DynamoDB Record', record.dynamodb);

    let newImage = record.dynamodb.NewImage;
    if (newImage) {
        for (let key in newImage) {
            if (newImage.hasOwnProperty(key)) {
                let item = newImage[key];

                if (item.S) {
                    result[key] = item.S;
                } else if (item.N) {
                    result[key] = item.N;
                } else if (item.M) {
                    result[key] = extractJson(item.M);
                } else if (item.L) {
                    result[key] = item.L.map(extractJson);
                } else {
                    result[key] = item;
                }
            }
        }
    }

    return result;
}