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

        // var token;
        //
        // particle.login({username: username, password: password}).then(
        //     function (data) {
        //         console.log('API call completed on promise resolve: ', data.body.access_token);
        //         oken = data.body.access_token;
        //     },
        //     function (err) {
        //         console.log('API call completed on promise fail: ', err);
        //     }
        // );
        // return Promise.resolve("asd");

    }
};

function handleNode(node, onMasterNode, onSlave) {
    if (isSlave(node)) {
        return nodeRepository.read(node.master).then(masterNode => {
            if (masterNode != null) {
                console.log("modules", masterNode.modules);
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
    if (node.modules.alarm) {
        return handleNode(
            function (node) {
                return login().then(token => {
                    return getVar(node.id, "A.status", token).then(status => {
                        console.log("Status", status);
                        return setNodeStatus(node.id, null, status, source, token);
                    })
                });
            },
            function (ip, node) {
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

function setNodeStatus(id, ip, currentStatus, source, sharedToken) {
    let promise = sharedToken ? Promise.resolve(sharedToken) : login();
    return promise.then(token => {
        let ipString = validString(ip) ? ip + "@" : "";
        let sourceString = validString(source) ? "," + source : "";
        if (currentStatus === "IDLE") {
            return execute(node.id, "A.status", ipString + "ACTIVATING" + sourceString, token).then(toStatus);
        } else {
            return execute(node.id, "A.status", ipString + "IDLE" + sourceString, token).then(toStatus);
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

function toStatus(number) {
    switch (number) {
        case -2:
            return "UNCHANGED";
        case -1:
            return "UNKNOWN";
        case 1:
            return "IDLE";
        case 2:
            return "ACTIVATING";
        case 3:
            return "ACTIVATED";
        case 4:
            return "SUSPICIOUS";
        case 5:
            return "ALARMED";
        case 6:
            return "SAFETY";
        case 7:
            return "SABOTAGE";
    }
}