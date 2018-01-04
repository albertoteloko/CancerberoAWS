package com.acs.cancerbero.lambda.marshaller;

import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public abstract class Marshaller<T> {
    private final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;

    public abstract JSONObject toJson(T input);

    public abstract T fromJson(JSONObject input);

    protected Map<String, String> toMap(JSONObject jsonObject) {
        if (jsonObject != null) {
            return jsonObject.keySet().stream().collect(Collectors.toMap(Function.identity(), jsonObject::getString));
        } else {
            return new HashMap<>();
        }
    }

    protected LocalDateTime getLocalDateTime(JSONObject jsonObject, String name) {
        try {
            return LocalDateTime.parse(jsonObject.getString(name));
        } catch (DateTimeParseException e) {
            throw new JSONException(e);
        }
    }

    protected void putLocalDateTime(JSONObject jsonObject, String name, LocalDateTime date) {
        try {
            jsonObject.put(name, date.format(ISO_FORMATTER));
        } catch (DateTimeParseException e) {
            throw new JSONException(e);
        }
    }
}
