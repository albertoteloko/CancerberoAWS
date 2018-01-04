package com.acs.cancerbero.lambda.json;

import org.json.JSONArray;
import org.json.JSONException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

public class JSONObject extends org.json.JSONObject {
    private final DateTimeFormatter isoDateFormatter = DateTimeFormatter.ISO_DATE;
    private final DateTimeFormatter isoDateTimeFormatter = DateTimeFormatter.ISO_DATE_TIME;

    public JSONObject() {
    }

    public JSONObject(String content) {
        super(content);
    }

    public JSONObject(org.json.JSONObject holder) {
        super(holder.toString(0));
    }

    public org.json.JSONObject put(String key, Object value, Object defaultValue) throws JSONException {
        return super.put(key, value != null ? value : defaultValue);
    }

    public <E extends Enum<E>> E getEnumOrNull(Class<E> clazz, String key) throws JSONException {
        return super.isNull(key) ? null : super.getEnum(clazz, key);
    }

    public Long getLongOrNull(String key) throws JSONException {
        return super.isNull(key) ? null : super.getLong(key);
    }

    public String getStringOrNull(String key) throws JSONException {
        return super.isNull(key) ? null : super.getString(key);
    }

    public Boolean getBooleanOrNull(String key) throws JSONException {
        return super.isNull(key) ? null : super.getBoolean(key);
    }

    public Double getDoubleOrNull(String key) throws JSONException {
        return super.isNull(key) ? null : super.getDouble(key);
    }

    public LocalDate getLocalDateOrNull(String key) {
        return super.isNull(key) ? null : LocalDate.parse(getString(key), isoDateFormatter);
    }

    public LocalDateTime getLocalDateTimeOrNull(String key) {
        return super.isNull(key) ? null : LocalDateTime.parse(getString(key), isoDateTimeFormatter);
    }

    public Instant getInstantOrNullFromEpoch(String key) {
        return super.isNull(key) ? null : Instant.ofEpochMilli(super.getLong(key));
    }

    public Instant getInstantOrNullFromIso(String key) {
        return super.isNull(key) ? null : Instant.parse(super.getString(key));
    }

    public <T> List<T> getList(String key, Function<JSONObject, T> converter) throws JSONException {
        List<T> values = new ArrayList<>();

        JSONArray array = getJSONArray(key);
        for (int i = 0; i < array.length(); i++) {
            values.add(converter.apply(new JSONObject(array.getJSONObject(i))));
        }

        return values;
    }

    public <T extends Number> List<T> getNumberList(String key, Function<Number, T> converter) throws JSONException {
        List<T> values = new ArrayList<>();

        JSONArray array = getJSONArray(key);
        for (int i = 0; i < array.length(); i++) {
            values.add(converter.apply(array.getBigDecimal(i)));
        }

        return values;
    }

    public List<String> getStringList(String key) throws JSONException {
        List<String> values = new ArrayList<>();

        JSONArray array = getJSONArray(key);
        for (int i = 0; i < array.length(); i++) {
            values.add(array.getString(i));
        }

        return values;
    }

    public void put(String key, JSON json) {
        put(key, toJson(json));
    }

    public void putJsonables(String key, Collection<? extends JSON> value) throws JSONException {
        put(key, value.stream().map(this::toJson).filter(Objects::nonNull).collect(Collectors.toList()));
    }

    public void put(String key, LocalDate localDate) {
        put(key, jsonWrap(() -> localDate.format(isoDateFormatter)));
    }

    public LocalDate getLocalDate(String key) {
        return jsonWrap(() -> LocalDate.parse(getString(key), isoDateFormatter));
    }

    public void put(String key, LocalDateTime localDateTime) {
        put(key, jsonWrap(() -> localDateTime.format(isoDateTimeFormatter)));
    }

    public LocalDateTime getLocalDateTime(String key) {
        return jsonWrap(() -> LocalDateTime.parse(getString(key), isoDateTimeFormatter));
    }

    public void putEpoch(String key, Instant instant) {
        put(key, jsonWrap(instant::toEpochMilli));
    }

    public Instant getInstantFromEpoch(String key) {
        return jsonWrap(() -> Instant.ofEpochMilli(super.getLong(key)));
    }

    public void putIso(String key, Instant instant) {
        put(key, jsonWrap(instant::toString));
    }

    public Instant getInstantFromIso(String key) {
        return jsonWrap(() -> Instant.parse(super.getString(key)));
    }

    public JSONObject getJSONObject(String key) throws JSONException {
        return new JSONObject(super.getJSONObject(key));
    }

    public JSONObject optJSONObject(String key) throws JSONException {
        return Optional.ofNullable(super.optJSONObject(key)).map(JSONObject::new).orElse(null);
    }

    public <T> T get(String key, Function<JSONObject, T> converter) throws JSONException {
        return jsonWrap(() -> converter.apply(getJSONObject(key)));
    }

    public <T> Optional<T> optGet(String key, Function<JSONObject, T> converter) throws JSONException {
        return jsonWrap(() -> Optional.ofNullable(optJSONObject(key)).map(converter));
    }

    private JSONObject toJson(JSON json) {
        return (json != null) ? json.toJson() : null;
    }

    private <T> T jsonWrap(Supplier<T> supplier) {
        try {
            return supplier.get();
        } catch (JSONException e) {
            throw e;
        } catch (Exception e) {
            throw new JSONException(e);
        }
    }
}
