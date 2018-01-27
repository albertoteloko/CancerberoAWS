const cardGateway = require('./card-gateway');
const keyGateway = require('./key-gateway');
const validations = require('../validations');

module.exports = {
    run: function (node, action, source) {
        console.log("Action in node " + node.id + ": ", action);

        let validation = validations.validateAction(action);

        if (validations.validString(validation)) {
            return Promise.reject({"code": 400, "message": validation});
        } else {
            if (action.type === "setup") {
                return setup(node, source);
            } else if (action.type === "alarmKey") {
                return keyGateway.alarmKey(node, source);
            } else if (action.type === "addCard") {
                return cardGateway.addCard(node, action.name, action.cardId, source);
            } else if (action.type === "removeCard") {
                return cardGateway.removeCard(node, action.cardId, source);
            } else {
                return Promise.reject({"code": 400, "message": "Missing/invalid name field"});
            }
        }
    }
};

function setup(node, source) {

}