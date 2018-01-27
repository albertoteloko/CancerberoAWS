const common = require('./common-gateway');

module.exports = {
    alarmKey: function (node, source) {
        if (common.nodeContainsAlarm(node)) {
            return common.handleNode(
                node,
                function (node) {
                    console.log("In master!", node);
                    return common.login().then(token => {
                        return common.getVar(node.id, "A.status", token).then(status => {
                            console.log("Status", status);
                            return setNodeStatus(node.id, null, status, source, token);
                        })
                    });
                },
                function (ip, node) {
                    console.log("In slave!", ip, node);
                    return common.login().then(token => {
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
};

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