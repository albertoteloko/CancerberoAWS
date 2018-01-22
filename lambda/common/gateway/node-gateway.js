const Particle = require('particle-api-js');
const validations = require('validations');

const username = process.env.PARTICLE_API_USER;
const password = process.env.PARTICLE_API_PASSWORD;

const particle = new Particle();

module.exports = {
    run: function (node, event, source) {
        console.log("Action in node " + node.id + ": ", event);

        if(event.name === "setAlarmStatus"){
            return setAlarmStatus(node, event, source);
        }else{
            return Promise.reject("Missing/invalid name field");
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
        return execute(node.id, "A.setStatus", "IDLE")
    }
};

function setAlarmStatus(node, event, source) {

}

function execute(nodeId, functionName, functionParam) {
    return particle.login({username: username, password: password}).then(data => {
        let token = data.body.access_token;
        return particle.callFunction({deviceId: nodeId, name: functionName, argument: functionParam, auth: token});
    });
}