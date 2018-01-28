const common = require('./common-gateway');

module.exports = {
    setup: function (node, modules, source) {
        if (modules.length === 0) {
            return common.login().then(token => {
                return Promise.all([
                    clearNode(node, token),
                    setupCard(node, token),
                    setupAlarm(node, token)
                ])
            });
        } else {
            return common.login().then(token => {
                let actions = [];
                if (containsModule(modules, "alarm")) {
                    actions.push(clearAlarm(node, token));
                    actions.push(setupAlarm(node, token));
                }
                if (containsModule(modules, "card")) {
                    actions.push(clearCard(node, token));
                    actions.push(setupCard(node, token));
                }
                if (containsModule(modules, "card")) {
                    actions.push(clearEthernetGateway(node, token));
                    actions.push(setupEthernetGateway(node, token));
                }
                return Promise.all(actions);
            });
        }
    }
};

function containsModule(modules, moduleName) {
    let result = false;

    for (let module of modules) {
        if (module.toLowerCase() === moduleName.toLowerCase()) {
            result = true;
            break;
        }
    }

    return result;
}

function clearNode(node, token) {
    return common.handleNode(
        node,
        function (node) {
            return common.execute(node.id, "clear", "", token);
        },
        function (ip, node) {
            return common.execute(node.master, "clear", ip + "@", token);
        }
    ).then(r => {
        return {"step": "clear", "result": r}
    })
}

function clearAlarm(node, token) {
    return common.handleNode(
        node,
        function (node) {
            return common.execute(node.id, "A.disable", "", token);
        },
        function (ip, node) {
            return common.execute(node.master, "A.disable", ip + "@", token);
        }
    ).then(r => {
        return {"step": "clear-alarm", "result": r}
    })
}

function clearCard(node, token) {
    return common.handleNode(
        node,
        function (node) {
            return common.execute(node.id, "C.disable", "", token);
        },
        function (ip, node) {
            return common.execute(node.master, "C.disable", ip + "@", token);
        }
    ).then(r => {
        return {"step": "clear-card", "result": r}
    })
}


function clearEthernetGateway(node, token) {
    return common.handleNode(
        node,
        function (node) {
            return common.execute(node.id, "EG.disable", "", token);
        },
        function (ip, node) {
            return common.execute(node.master, "EG.disable", ip + "@", token);
        }
    ).then(r => {
        return {"step": "clear-ethernet-gateway", "result": r}
    })
}

function setupAlarm(node, token) {
    if (common.nodeContainsAlarm(node)) {
        let alarmString = toAlarmString(node);
        return common.handleNode(
            node,
            function (node) {
                return common.execute(node.id, "A.enable", alarmString, token);
            },
            function (ip, node) {
                return common.execute(node.master, "A.enable", ip + "@" + alarmString, token);
            }
        ).then(r => {
            return {"step": "alarm", "result": r, "setupLine": alarmString}
        })
    } else {
        return Promise.resolve({"step": "alarm", "result": "Module disabled"})
    }
}

function setupCard(node, token) {
    if (common.nodeContainsCard(node)) {
        return common.handleNode(
            node,
            function (node) {
                return setupCardInternal(node.id, node.modules.card, "", token);
            },
            function (ip, node) {
                return setupCardInternal(node.master, node.modules.card, ip + "@", token);
            }
        ).then(r => {
            return {"step": "card", "result": r}
        })
    } else {
        return Promise.resolve({"step": "card", "result": "Module disabled"})
    }
}

function setupCardInternal(nodeId, cardModule, prefix, token) {
    let promises = [];

    let alarmString = toCardSetupString(cardModule);

    promises.push(common.execute(nodeId, "C.enable", prefix + alarmString, token).then(r => {
        return {"step": "card-setup", "result": r, "setupLine": alarmString}
    }));

    for (let cardId in cardModule.entries) {
        if (cardModule.entries.hasOwnProperty(cardId)) {
            let cardName = cardModule.entries[cardId];
            promises.push(common.execute(nodeId, "C.add", prefix + cardId, token).then(r => {
                return {"step": "card-add", "result": r, "cardName": cardName, "cardId": cardId}
            }));
        }
    }

    return Promise.all(promises);
}

function setupEthernetGateway(node, token) {
    if (common.nodeContainsEthernetGateway(node)) {
        return common.handleNode(
            node,
            function (node) {
                return setupCardInternal(node.id, node.modules['ethernet-gateway'], "", token);
            },
            function (ip, node) {
                return setupCardInternal(node.master, node.modules['ethernet-gateway'], ip + "@", token);
            }
        ).then(r => {
            return {"step": "card-gateway", "result": r}
        })
    } else {
        return Promise.resolve({"step": "card-gateway", "result": "Module disabled"})
    }
}

function toAlarmString(node) {
    let alarm = node.modules.alarm;
    let string = alarm.activatingTime + "," + alarm.suspiciousTime;

    for (let pinId in alarm.pins) {
        if (alarm.pins.hasOwnProperty(pinId)) {
            let pin = alarm.pins[pinId];
            console.log(pinId + " -> " + pin);
            string += ",";
            string += pinId + "|" + getType(pin.type) + "|" + getInput(pin.input) + "|" + pin.threshold + "|" + getMode(pin.mode);
        }
    }

    return string;
}

function toCardSetupString(cardModule) {
    return cardModule.spi + "|" + cardModule.ss;
}

function getType(input) {
    if (input === "SENSOR") {
        return "S";
    } else if (input === "KEY") {
        return "K";
    } else if (input === "SABOTAGE_IN") {
        return "SABI";
    } else if (input === "SABOTAGE_OUT") {
        return "SABO";
    } else if (input === "SAFETY") {
        return "SAF";
    } else {
        return input;
    }
}

function getInput(input) {
    if (input === "DIGITAL") {
        return "D";
    } else if (input === "ANALOG") {
        return "A";
    } else {
        return input;
    }
}

function getMode(input) {
    if (input === "HIGH") {
        return "H";
    } else if (input === "LOW") {
        return "L";
    } else {
        return input;
    }
}

function setNodeStatus(id, ip, currentStatus, source, sharedToken) {
    let promise = sharedToken ? Promise.resolve(sharedToken) : common.login();
    return promise.then(token => {
        let ipString = common.defined(ip) ? ip + "@" : "";
        let sourceString = common.defined(source) ? "," + source : "";
        if (currentStatus === "IDLE") {
            return common.execute(id, "A.status", ipString + "ACTIVATING" + sourceString, token).then(toStatusResult);
        } else {
            return common.execute(id, "A.status", ipString + "IDLE" + sourceString, token).then(toStatusResult);
        }
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