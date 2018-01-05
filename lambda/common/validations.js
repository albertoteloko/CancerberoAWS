const ALARM_STATUSES = ["IDLE", "ACTIVATING", "ACTIVATED", "SUSPICIOUS", "ALARMED", "SABOTAGE", "SAFETY"];
const LOG_LEVELS = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"];
module.exports = {
    validString(value) {
        return (value !== undefined) && (value !== null) && (value !== '');
    },
    validAlarmStatus(value) {
        return this.validString(value) && ALARM_STATUSES.indexOf(value.toUpperCase()) > -1;
    },
    validLogLevel(value) {
        return this.validString(value) && LOG_LEVELS.indexOf(value.toUpperCase()) > -1;
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
        } else if (event.type === "alarm-pin-activated") {
            return this.validatePinActivatedEvent(event);
        } else if (event.type === "alarm-pin-changed") {
            return this.validatePinChangedEvent(event);
        } else if (event.type === "alarm-status-changed") {
            return this.validateAlarmStatusChangedEvent(event);
        } else if (event.type === "log") {
            return this.validateLogEvent(event);
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
    validatePinChangedEvent(event) {
        if (!this.validString(event.pinId)) {
            return "Missing/Invalid pinId param";
        } else if (!this.validString(event.value)) {
            return "Missing/Invalid value param";
        }
        return null;
    },
    validateAlarmStatusChangedEvent(event) {
        if (!this.validAlarmStatus(event.value)) {
            return "Missing/Invalid value param";
        } else if (!this.validString(event.source)) {
            return "Missing/Invalid source param";
        }
        return null;
    },
    validateLogEvent(event) {
        if (!this.validLogLevel(event.level)) {
            return "Missing/Invalid level param";
        } else if (!this.validString(event.class)) {
            return "Missing/Invalid class param";
        } else if (!this.validString(event.message)) {
            return "Missing/Invalid message param";
        }
        return null;
    }
};
