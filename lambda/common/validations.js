module.exports = {
    validString(value) {
        return (value !== undefined) && (value !== null) && (value !== '');
    },
    validDate(value) {
        return !isNaN(Date.parse(value));
    },
    validBoolean(value) {
        return (value !== undefined) && (value !== null) && (typeof(value) === "boolean")
    },
    validateEvent(event) {
        if (!this.validString(event.type)) {
            return "Missing/Invalid type param";
        } else if (!this.validString(event.nodeId)) {
            return "Missing/Invalid nodeId param";
        } else if (!this.validDate(event.timestamp)) {
            return "Missing/Invalid timestamp param";
        }

        if (event.type === "ping") {
            return this.validatePingEvent(event);
        } else if (event.type === "pin-activated") {
            return this.validatePinActivatedEvent(event);
        } else if (event.type === "pin-change") {
            return this.validatePinChangeEvent(event);
        } else if (event.type === "status-change") {
            return this.validateNodeStatusChangeEvent(event);
        }
        return null;
    },
    validatePingEvent(event) {
        return null;
    },
    validatePinActivatedEvent(event) {
        if (!this.validString(event.pinId)) {
            return "Missing/Invalid pinId param";
        } else if (!this.validString(event.value)) {
            return "Missing/Invalid value param";
        }
        return null;
    },
    validatePinChangeEvent(event) {
        if (!this.validString(event.pinId)) {
            return "Missing/Invalid pinId param";
        } else if (!this.validString(event.value)) {
            return "Missing/Invalid value param";
        }
        return null;
    },
    validateNodeStatusChangeEvent(event) {
        if (!this.validString(event.status)) {
            return "Missing/Invalid status param";
        }
        return null;
    }
};
