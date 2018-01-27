const common = require('./common-gateway');
const nodeRepository = require('../repository/node-repository');


module.exports = {
    addCard: function (node, cardName, cardId, source) {
        if (common.nodeContainsCard(node)) {
            if (!common.defined(node.modules.card.entries[cardId])) {
                return common.handleNode(
                    node,
                    function (node) {
                        console.log("In master!", node);
                        return common.login().then(token => {
                            return addCardEntry(node.id, null, cardId, source, token);
                        });
                    },
                    function (ip, node) {
                        console.log("In slave!", ip, node);
                        return common.login().then(token => {
                            return addCardEntry(node.master, ip, cardId, source, token);
                        });
                    }
                ).then(r => {
                    node.modules.card.entries[cardId] = cardName;
                    return nodeRepository.save(node).then(v => r);
                });
            } else {
                return Promise.reject({"code": 412, "message": "Node does contains the card id: " + cardId});
            }
        } else {
            return Promise.reject({"code": 412, "message": "Node doesn't have any card module"});
        }
    },
    removeCard: function (node, cardId, source) {
        if (common.nodeContainsCard(node)) {
            if (common.defined(node.modules.card.entries[cardId])) {
                return common.handleNode(
                    node,
                    function (node) {
                        console.log("In master!", node);
                        return common.login().then(token => {
                            return removeCardEntry(node.id, null, cardId, source, token);
                        });
                    },
                    function (ip, node) {
                        console.log("In slave!", ip, node);
                        return common.login().then(token => {
                            return removeCardEntry(node.master, ip, cardId, source, token);
                        });
                    }
                ).then(r => {
                    delete  node.modules.card.entries[cardId];
                    return nodeRepository.save(node).then(v => r);
                });
            } else {
                return Promise.reject({"code": 412, "message": "Node does not contains the card id: " + cardId});
            }
        } else {
            return Promise.reject({"code": 412, "message": "Node doesn't have any card module"});
        }
    }
};

function addCardEntry(id, ip, cardId, source, sharedToken) {
    let promise = sharedToken ? Promise.resolve(sharedToken) : common.login();
    return promise.then(token => {
        let ipString = common.defined(ip) ? ip + "@" : "";
        return common.execute(id, "C.add", ipString + cardId, token).then(toCardResult);
    });
}

function removeCardEntry(id, ip, cardId, source, sharedToken) {
    let promise = sharedToken ? Promise.resolve(sharedToken) : common.login();
    return promise.then(token => {
        let ipString = common.defined(ip) ? ip + "@" : "";
        return common.execute(id, "C.del", ipString + cardId, token).then(toCardResult);
    });
}

function toCardResult(number) {
    switch (number) {
        case -1:
            return Promise.reject({"code": 400, "message": "Invalid id"});
        case -5:
            return Promise.reject({"code": 412, "message": "Not found"});
        case -10:
            return Promise.reject({"code": 412, "message": "Not space left"});
        case -15:
            return Promise.reject({"code": 412, "message": "Already added"});
        default:
            return Promise.resolve({"index": number});
    }
}