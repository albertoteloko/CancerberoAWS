package com.acs.cancerbero.lambda.model;

import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.json.JSONObject;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@ToString
@EqualsAndHashCode
public class APIGatewayResponse {

    public static APIGatewayResponse error(int statusCode, Throwable e) {
        JSONObject body = new JSONObject();
        body.put("error", e.getMessage());
        body.put("class", e.getClass().getName());

        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        String stacktrace = sw.toString();
        body.put("stacktrace", stacktrace);


        return fromJson(statusCode, new HashMap<>(), body);
    }

    public static APIGatewayResponse error(int statusCode, String errorMessage) {
        JSONObject body = new JSONObject();
        body.put("error", errorMessage);
        return fromJson(statusCode, new HashMap<>(), body);
    }
    public static APIGatewayResponse fromJson(int statusCode, JSONObject body) {
        return fromJson(statusCode, new HashMap<>(), body);
    }

    public static APIGatewayResponse fromJson(int statusCode, Map<String, String> headers, JSONObject body) {
        if (!headers.containsKey("Content-Type")) {
            headers.put("Content-Type", "application/json");
        }
        return new APIGatewayResponse(statusCode, headers, Optional.of(body.toString(2)));
    }

    public final int statusCode;
    public final Map<String, String> headers;
    public final Optional<String> body;

    public APIGatewayResponse(int statusCode, Map<String, String> headers, Optional<String> body) {
        this.statusCode = statusCode;
        this.headers = Collections.unmodifiableMap(headers);
        this.body = body;
    }
}
