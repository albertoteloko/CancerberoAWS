const AWS = require('aws-sdk');


const region = process.env.AWS_REGION;
const snsArn = process.env.SNS_ARN;

AWS.config.region = region;

module.exports = {
    sendEvent(event, callback){
        let sns = new AWS.SNS();

        console.log("SNS event", event);

        sns.publish({
            Message: JSON.stringify(event),
            TopicArn: snsArn
        }, callback);
    }
};