const Particle = require('particle-api-js');
const validations = require('validations');
const nodeRepository = require('../repository/node-repository');

const username = process.env.PARTICLE_API_USER;
const password = process.env.PARTICLE_API_PASSWORD;

const particle = new Particle();

module.exports = {
    run: function (node, action, source) {
        console.log("Action in node " + node.id + ": ", action);

        if (action.name === "alarmKey") {
            return alarmKey(node, action.source);
        } else {
            return Promise.reject({"code": 400, "message": "Missing/invalid name field"});
        }
    }
};

function handleNode(node, onMasterNode, onSlave) {
    if (isSlave(node)) {
        return nodeRepository.read(node.master).then(masterNode => {
            if (masterNode != null) {
                if (masterNode.modules['ethernet-gateway']) {
                    const ethernetGateway = masterNode.modules['ethernet-gateway'];
                    if (ethernetGateway.nodes[node.id]) {
                        const ip = ethernetGateway.nodes[node.id];
                        return onSlave(ip, node);
                    } else {
                        return Promise.reject("Master node " + node.master + " does not have the IP of node " + node.id);
                    }
                } else {
                    return Promise.reject("Master node " + node.master + " does not have an ethernet gateway");
                }
            } else {
                return Promise.reject("Master node " + node.master + " not found");
            }

        });
    } else {
        return onMasterNode(node);
    }
}

function alarmKey(node, source) {
    if (nodeContainsAlarm(node)) {
        return handleNode(
            node,
            function (node) {
                console.log("In master!", node);
                return login().then(token => {
                    return getVar(node.id, "A.status", token).then(status => {
                        console.log("Status", status);
                        return setNodeStatus(node.id, null, status, source, token);
                    })
                });
            },
            function (ip, node) {
                console.log("In slave!", ip, node);
                return login().then(token => {
                    let status = node.modules.alarm.status.value;
                    console.log("Status", status);
                    return setNodeStatus(node.master, ip, status, source, token);
                });
            }
        );
    } else {
        return Promise.reject({"code": 412, "message": "Node doesn't have any alarm module"});
    }
}

function nodeContainsAlarm(node) {
    return defined(node) && defined(node.modules) && defined(node.modules.alarm)
}
function defined(value) {
    return (value !== undefined) && (value != null)
}

function setNodeStatus(id, ip, currentStatus, source, sharedToken) {
    let promise = sharedToken ? Promise.resolve(sharedToken) : login();
    return promise.then(token => {
        let ipString = validString(ip) ? ip + "@" : "";
        let sourceString = validString(source) ? "," + source : "";
        if (currentStatus === "IDLE") {
            return execute(id, "A.status", ipString + "ACTIVATING" + sourceString, token).then(toStatusResult);
        } else {
            return execute(id, "A.status", ipString + "IDLE" + sourceString, token).then(toStatusResult);
        }
    });
}

function validString(value) {
    return (value !== undefined) && (value != null)
}

function isSlave(node) {
    return (node.master !== undefined) && (node.type !== 'PHOTON') && (node.type !== 'ELECTRON')
}

function login() {
    return particle.login({username: username, password: password}).then(data => data.body.access_token);
}

function execute(nodeId, functionName, functionParam, sharedToken) {
    let promise = sharedToken ? Promise.resolve(sharedToken) : login();
    return promise.then(token => {
        return particle.callFunction({
            deviceId: nodeId,
            name: functionName,
            argument: functionParam,
            auth: token
        }).then(data => data.body.return_value);
    });
}

function getVar(nodeId, varName, sharedToken) {
    let promise = sharedToken ? Promise.resolve(sharedToken) : login();
    return promise.then(token => {
        return particle.getVariable({
            deviceId: nodeId,
            name: varName,
            auth: token
        }).then(data => data.body.result);
    });
}

function toStatusResult(number) {
    switch (number) {
        case -3:
            return Promise.reject({"code": 500, "message": "Ethernet gateway disabled"});
        case -2:
            return Promise.reject({"code": 412, "message": "Status unchanged"});
        case -1:
            return Promise.reject({"code": 400, "message": "Status unknown"});
        case 1:
            return Promise.resolve({"status": "IDLE"});
        case 2:
            return Promise.resolve({"status": "ACTIVATING"});
        case 3:
            return Promise.resolve({"status": "ACTIVATED"});
        case 4:
            return Promise.resolve({"status": "SUSPICIOUS"});
        case 5:
            return Promise.resolve({"status": "ALARMED"});
        case 6:
            return Promise.resolve({"status": "SAFETY"});
        case 7:
            return Promise.resolve({"status": "SABOTAGE"});
        default:
            return Promise.reject({"code": 500, "message": "Unknown error: " + number});
    }
}