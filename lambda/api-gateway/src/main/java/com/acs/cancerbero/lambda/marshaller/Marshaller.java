package com.acs.cancerbero.lambda.marshaller;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public abstract class Marshaller<T> {
    public abstract JSONObject toJson(T input);

    public abstract T fromJson(JSONObject input);

    protected Map<String, String> toMap(JSONObject jsonObject) {
        if (jsonObject != null) {
            return jsonObject.keySet().stream().collect(Collectors.toMap(Function.identity(), jsonObject::getString));
        } else {
            return new HashMap<>();
        }
    }
}
