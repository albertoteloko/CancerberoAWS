const nodeRepository = require('repository/node-repository');

const AWS = require('aws-sdk');


const region = process.env.AWS_REGION;

AWS.config.region = region;

module.exports = {
    handle(event) {
        if (event.type === 'ping') {
            return handlePing(event);
        } else if (event.type === 'alarm-pin-activated') {
            return handlePinActivated(event);
        } else if (event.type === 'alarm-pin-changed') {
            return handlePinChanged(event);
        } else if (event.type === 'alarm-status-changed') {
            return handleAlarmStatusChanged(event);
        } else if (event.type === 'log') {
            return handleLog(event);
        } else {
            return Promise.reject("Unknown event name: " + event.type);
        }

    }
};

function handlePing(event) {
    return nodeRepository.updatePing(event.nodeId, event.timestamp);
}

function handlePinActivated(event) {
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {
        if (node != null) {
            let pin = node.modules.alarm.pins[event.pinId];
            if (pin !== undefined) {
                notifyEvents(node.topics, event);
                return nodeRepository.setPinActivated(nodeId, event.pinId, event.value, event.timestamp);
            } else {
                return Promise.reject("Node " + nodeId + " does not have a pin " + event.pinId);
            }
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}

function handlePinChanged(event) {
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {
        if (node != null) {
            let pin = node.modules.alarm.pins[event.pinId];
            if (pin !== undefined) {
                if ((pin.readings !== undefined) && (pin.readings.value === event.value)) {
                    return Promise.reject("Node " + nodeId + " and pin " + event.pinId + " does not change its value");
                }
                notifyEvents(node.topics, event);
                return nodeRepository.setPinReading(nodeId, event.pinId, event.value, event.timestamp);
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
            notifyEvents(node.topics, event);
            return nodeRepository.updateAlarmStatus(nodeId, event.value, event.source, event.timestamp);
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}

function notifyEvents(topics, event) {
    console.info("Sending event", topics, event);

    let message = {
        "data": {
            "event": event,
        },
        "time_to_live": 3600,
        "collapse_key": "deals"
    };

    let finalMessage = JSON.stringify({"GCM": JSON.stringify(message)}).replace("\\\\", "\\");
    topics.forEach(topicArn => publish(topicArn, finalMessage));
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