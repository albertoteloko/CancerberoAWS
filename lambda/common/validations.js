const ALARM_STATUSES = ["IDLE", "ACTIVATING", "ACTIVATED", "SUSPICIOUS", "ALARMED", "SABOTAGE", "SAFETY"];
const LOG_LEVELS = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

module.exports = {
    validArray(value) {
        return (value !== undefined) && (value !== null) && (Array.isArray(value));
    },
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
    validateAction(event) {
        if (!this.validString(event.type)) {
            return "Missing/Invalid type param";
        } else if (!this.validDate(event.timestamp)) {
            return "Missing/Invalid timestamp param";
        }

        if (event.type === "alarmKey") {
            return this.validateAlarmKeyAction(event);
        } else if (event.type === "addCard") {
            return this.validateAddCardAction(event);
        } else if (event.type === "removeCard") {
            return this.validateRemoveCardAction(event);
        } else if (event.type === "setup") {
            return this.validateSetupAction(event);
        }
        return null;
    },
    validateAlarmKeyAction(event) {
        return null;
    },
    validateAddCardAction(event) {
        if (!this.validString(event.name)) {
            return "Missing/Invalid name param";
        } else if (!this.validString(event.cardId)) {
            return "Missing/Invalid cardId param";
        }
        return null;
    },
    validateSetupAction(event) {
        if (!this.validArray(event.modules)) {
            return "Missing/Invalid modules param";
        }
        return null;
    },
    validateRemoveCardAction(event) {
        if (!this.validString(event.cardId)) {
            return "Missing/Invalid cardId param";
        }
        return null;
    },
    validateEvent(event) {
        if (!this.validString(event.type)) {
            return "Missing/Invalid type param";
        } else if (!this.validString(event.nodeId)) {
            return "Missing/Invalid nodeId param";
        } else if (!this.validDate(event.timestamp)) {
            return "Missing/Invalid timestamp param";
        }

        if (event.type === "alarm-pin-value") {
            return this.validatePinValueEvent(event);
        } else if (event.type === "alarm-status-changed") {
            return this.validateAlarmStatusChangedEvent(event);
        } else if (event.type === "log") {
            return this.validateLogEvent(event);
        }
        return null;
    },
    validatePinValueEvent(event) {
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
