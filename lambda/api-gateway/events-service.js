const nodeRepository = require('node-repository');
const pinChangeEventRepository = require('pin-change-event-repository');
const nodeStatusChangeEventRepository = require('node-status-change-event-repository');

module.exports = {
    handle(event) {
        if (event.name === 'pin-change') {
            return handlePinChange(event);
        } else if (event.name === 'status-change') {
            return handleNodeStatusChange(event);
        } else {
            return Promise.reject("Unknown event name: " + event.name);
        }

    }
};

function handlePinChange(event) {
    const nodeId = event.nodeId;
    const pinId = event.pinId;
    const value = event.value;
    return Promise.all([
        nodeRepository.getNode(nodeId),
        pinChangeEventRepository.getLatestPinStatus(nodeId, pinId)
    ]).then(values => {
        const node = values[0];
        const latestStatus = values[1];

        if (node != null) {
            const pin = findPin(node.pins, pinId);

            if (pin != null) {
                if (value !== latestStatus) {
                    return pinChangeEventRepository.storePinChange(node.id, pinId, value)
                } else {
                    return Promise.reject("No changes in the pin value");
                }
            } else {
                return Promise.reject("Node " + nodeId + " does not have a pin " + pinId)
            }
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}

function handleNodeStatusChange(event) {
    const nodeId = event.nodeId;
    const status = event.status;
    return nodeRepository.getNode(nodeId).then(node => {
        if (node != null) {
            if (status !== node.status) {
                return nodeStatusChangeEventRepository.storeStatusChange(node.id, status)
            } else {
                return Promise.reject("No changes in the node status");
            }
        } else {
            return Promise.reject("Node " + nodeId + " not found")
        }
    });
}

function findPin(pins, pinId) {
    for (let pin of pins) {
        if (pin.pin_id === pinId) {
            return pin;
        }
    }
    return null;
}