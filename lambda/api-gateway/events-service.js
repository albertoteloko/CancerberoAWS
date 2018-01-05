const nodeRepository = require('node-repository');
const eventRepository = require('event-repository');
// const pinChangeEventRepository = require('pin-change-event-repository');
// const nodeStatusChangeEventRepository = require('node-status-change-event-repository');

module.exports = {
    handle(event) {
        if (event.type === 'ping') {
            return handlePing(event);
        } else if (event.type === 'pin-activated') {
            return handlePinActivation(event);
            } else if (event.type === 'pin-change') {
                return handlePinChange(event);
            // } else if (event.name === 'status-change') {
            //     return handleNodeStatusChange(event);
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

function handlePinActivation(event) {
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {
        if (node != null) {
            let pins = node.pins.filter(p => p.id === event.pinId);
            if (pins.length !== 0) {
                for (let pin of pins) {
                    setPinActivations(pin, event);
                    setPinReading(pin, event);
                }
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

function handlePinChange(event) {
    const nodeId = event.nodeId;
    return nodeRepository.read(nodeId).then(node => {
        if (node != null) {
            let pins = node.pins.filter(p => p.id === event.pinId);
            if (pins.length !== 0) {
                for (let pin of pins) {
                    if((pin.readings !== undefined) &&(pin.readings.value === event.value)){
                        return Promise.reject("Node " + nodeId + " and pin " + event.pinId + " does not change its value");
                    }
                    setPinReading(pin, event);
                }
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

function setPinActivations(pin, event) {
    if(pin.activations === undefined){
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


// function handlePinChange(event) {
//     const nodeId = event.nodeId;
//     const pinId = event.pinId;
//     const value = event.value;
//     return Promise.all([
//         nodeRepository.getNode(nodeId),
//         pinChangeEventRepository.getLatestPinStatus(nodeId, pinId)
//     ]).then(values => {
//         const node = values[0];
//         const latestStatus = values[1];
//
//         if (node != null) {
//             const pin = findPin(node.pins, pinId);
//
//             if (pin != null) {
//                 if (value !== latestStatus) {
//                     return pinChangeEventRepository.storePinChange(node.id, pinId, value)
//                 } else {
//                     return Promise.reject("No changes in the pin value");
//                 }
//             } else {
//                 return Promise.reject("Node " + nodeId + " does not have a pin " + pinId)
//             }
//         } else {
//             return Promise.reject("Node " + nodeId + " not found")
//         }
//     });
// }
//
// function handleNodeStatusChange(event) {
//     const nodeId = event.nodeId;
//     const status = event.status;
//     return nodeRepository.getNode(nodeId).then(node => {
//         if (node != null) {
//             if (status !== node.status) {
//                 return nodeStatusChangeEventRepository.storeStatusChange(node.id, status)
//             } else {
//                 return Promise.reject("No changes in the node status");
//             }
//         } else {
//             return Promise.reject("Node " + nodeId + " not found")
//         }
//     });
// }
//
// function findPin(pins, pinId) {
//     for (let pin of pins) {
//         if (pin.pin_id === pinId) {
//             return pin;
//         }
//     }
//     return null;
// }