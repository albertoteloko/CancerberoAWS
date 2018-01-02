let alarmRepository = require('alarm-repository');

module.exports = {
    findByDeviceId: function (deviceId) {
        return {
            name: "Talamanca",
            onPinChange: function (eventId, deviceId, pinName, value, timestamp) {
                let pin = this.findPin(deviceId, pinName);

                if (pin !== null) {
                    if (pin.value !== value) {
                        alarmRepository.storePinchange(eventId, deviceId, pinName, value, timestamp);
                        pin.setValue(value);
                    }
                } else {
                    console.error("Pin", pin, "not found")
                }
            },
            findPin: function (deviceId, pin) {
                return {
                    setValue: function (value) {

                    },
                    value: false
                }
            }

        }
    }
};