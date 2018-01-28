const Particle = require('particle-api-js');
const nodeRepository = require('../repository/node-repository');

const username = process.env.PARTICLE_API_USER;
const password = process.env.PARTICLE_API_PASSWORD;

const particle = new Particle();

module.exports = {
    handleNode: function (node, onMasterNode, onSlave) {
        if (this.isSlave(node)) {
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
    },
    nodeContainsAlarm: function (node) {
        return this.defined(node) && this.defined(node.modules) && this.defined(node.modules.alarm)
    },
    nodeContainsCard: function (node) {
        return this.defined(node) && this.defined(node.modules) && this.defined(node.modules.card)
    },
    nodeContainsEthernetGateway: function (node) {
        return this.defined(node) && this.defined(node.modules) && this.defined(node.modules['ethernet-gateway'])
    },
    defined: function (value) {
        return (value !== undefined) && (value != null)
    },
    isSlave: function (node) {
        return (node.master !== undefined) && (node.type !== 'PHOTON') && (node.type !== 'ELECTRON')
    },
    login: function () {
        return particle.login({username: username, password: password}).then(data => data.body.access_token);
    },
    execute: function (nodeId, functionName, functionParam, sharedToken) {
        let promise = sharedToken ? Promise.resolve(sharedToken) : this.login();
        return promise.then(token => {
            return particle.callFunction({
                deviceId: nodeId,
                name: functionName,
                argument: functionParam,
                auth: token
            }).then(data => data.body.return_value);
        });
    },
    getVar: function (nodeId, varName, sharedToken) {
        let promise = sharedToken ? Promise.resolve(sharedToken) : this.login();
        return promise.then(token => {
            return particle.getVariable({
                deviceId: nodeId,
                name: varName,
                auth: token
            }).then(data => data.body.result);
        });
    }
};