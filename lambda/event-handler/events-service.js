const nodeRepository = require('repository/node-repository');

const AWS = require('aws-sdk');


const region = process.env.AWS_REGION;
const poolId = process.env.POOL_ID;

AWS.config.region = region;

module.exports = {
    handle(event) {
        if (event.type === 'alarm-pin-value') {
            return handlePinValue(event);
        } else if (event.type === 'alarm-status-changed') {
            return handleAlarmStatusChanged(event);
        } else if (event.type === 'log') {
            return handleLog(event);
        } else {
            return Promise.reject("Unknown event name: " + event.type);
        }

    }
};

function handlePinValue(event) {
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {
        if (node != null) {
            let pin = node.modules.alarm.pins[event.pinId];
            if (pin !== undefined) {
                if ((pin.readings !== undefined) && (pin.readings.value !== event.value)) {
                    notifyEvents(node.topic, event);
                }
                return nodeRepository.setPinValue(nodeId, event.pinId, event.value, event.timestamp);
            } else {
                return Promise.reject("Node " + nodeId + " does not have a pin " + event.pinId);
            }
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}

function handleAlarmStatusChanged(event) {
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {
        if (node != null) {
            let alarm = node.modules.alarm;
            if ((alarm.status !== undefined) && (alarm.status.value === event.value)) {
                return Promise.reject("Node " + nodeId + " does not change its status");
            }
            return getSourceName(node, event.source).then(sourceName => {
                notifyEvents(node.topic, event);
                return nodeRepository.updateAlarmStatus(nodeId, event.value, event.source, sourceName, event.timestamp);
            });
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}

function getSourceName(node, source) {
    try {
        if (source.startsWith("P:")) {
            return Promise.resolve(node.modules.alarm.pins[source.substring(2)].name)
        } else if (source.startsWith("C:")) {
            return Promise.resolve(node.modules.card.entries[source.substring(2)])
        } else if (source.startsWith("U:")) {
            AWS.config.apiVersions = {
                cognitoidentityserviceprovider: '2016-04-18',
            };

            let provider = new AWS.CognitoIdentityServiceProvider();
            let params = {
                UserPoolId: poolId,
                Username: source.substring(2)
            };
            return provider.adminGetUser(params).promise().then(userParams => {
                console.log("params", userParams);

                return userParams.UserAttributes.filter(a => a.Name === 'given_name')[0].Value
            });
        } else {
            return Promise.resolve(source);
        }
    } catch (e) {
        console.log("Error getting source name", e);
        return Promise.resolve(undefined)
    }
}

function notifyEvents(topic, event) {
    console.info("Sending event", topic, event);

    let message = {
        "data": {
            "event": event,
        },
        "time_to_live": 3600,
        "collapse_key": "deals"
    };

    let finalMessage = JSON.stringify({"GCM": JSON.stringify(message)}).replace("\\\\", "\\");
    publish(topic, finalMessage);
}

function publish(topic, message) {
    console.info({
        Message: message,
        TargetArn: topic
    });

    let sns = new AWS.SNS();
    sns.publish({
        Message: message,
        TargetArn: topic,
        MessageStructure: 'json'
    }, function (err, data) {
        if (err) {
            console.log(err.stack);
            return;
        }
        console.log('push sent');
        console.log(data);
    });
}

function handleLog(event) {
    return Promise.resolve(event.nodeId + " - " + event.level + " - " + event.class + " - " + event.message);
}