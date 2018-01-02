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
        if (!this.validString(event.name)) {
            return "Missing/Invalid name param";
        } else if (!this.validString(event.nodeId)) {
            return "Missing/Invalid nodeId param";
        }

        if (event.name === "pin-change") {
            return this.validatePinChangeEvent(event);
        } else if (event.name === "status-change") {
            return this.validateNodeStatusChangeEvent(event);
        }
        return null;
    },
    validatePinChangeEvent(event) {
        if (!this.validString(event.pinId)) {
            return "Missing/Invalid pinId param";
        } else if (!this.validBoolean(event.value)) {
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
