package com.acs.cancerbero.lambda.model.api;

import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.json.JSONObject;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@ToString
@EqualsAndHashCode
public class APIGatewayRequest {

    public final String resource;
    public final String path;
    public final HTTPMethod method;
    public final Map<String, String> headers;
    public final Map<String, String> queryParameters;
    public final Map<String, String> pathParameters;
    public final Map<String, String> stageVariables;
    public final Optional<String> body;

    public APIGatewayRequest(String resource, String path, HTTPMethod method, Map<String, String> headers, Map<String, String> queryParameters, Map<String, String> pathParameters, Map<String, String> stageVariables, Optional<String> body) {
        this.resource = resource;
        this.path = path;
        this.method = method;
        this.headers = Collections.unmodifiableMap(headers);
        this.queryParameters = Collections.unmodifiableMap(queryParameters);
        this.pathParameters = Collections.unmodifiableMap(pathParameters);
        this.stageVariables = Collections.unmodifiableMap(stageVariables);
        this.body = body;
    }

    public <T> Optional<T> fromJson(Function<JSONObject, T> converter) {
        return body.map(s -> converter.apply(new JSONObject(s)));
    }
}
