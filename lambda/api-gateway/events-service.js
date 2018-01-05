const nodeRepository = require('node-repository');
const eventRepository = require('event-repository');

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
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {

        if (node != null) {
            node.lastPing = event.timestamp;
            return nodeRepository.save(node).then(result => {
                return eventRepository.save(event);
            });
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}

function handlePinActivated(event) {
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {
        if (node != null) {
            let pin = node.modules.alarm.pins[event.pinId];
            if (pin !== undefined) {
                setPinActivations(pin, event);
                setPinReading(pin, event);
                return nodeRepository.save(node).then(result => {
                    return eventRepository.save(event);
                });
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
                setPinReading(pin, event);
                return nodeRepository.save(node).then(result => {
                    return eventRepository.save(event);
                });
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
            setAlarmStatus(alarm, event);
            return nodeRepository.save(node).then(result => {
                return eventRepository.save(event);
            });
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}

function handleLog(event) {
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {
        if (node != null) {
            return eventRepository.save(event);
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}


function setPinActivations(pin, event) {
    if (pin.activations === undefined) {
        pin.activations = {};
    }
    pin.activations.timestamp = event.timestamp;
    pin.activations.value = event.value;
}

function setPinReading(pin, event) {
    if (pin.readings === undefined) {
        pin.readings = {};
    }
    pin.readings.timestamp = event.timestamp;
    pin.readings.value = event.value;
}

function setAlarmStatus(alarm, event) {
    if (alarm.status === undefined) {
        alarm.status = {};
    }
    alarm.status.timestamp = event.timestamp;
    alarm.status.value = event.value;
    alarm.status.source = event.source;
}