package com.acs.cancerbero.lambda.marshaller;

import com.acs.cancerbero.lambda.model.APIGatewayResponse;
import org.json.JSONObject;

import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

public class ApiGatewayResponseMarshaller extends Marshaller<APIGatewayResponse> {
    @Override
    public JSONObject toJson(APIGatewayResponse input) {
        JSONObject result = new JSONObject();
        result.put("statusCode", input.statusCode);
        result.put("headers", input.headers);
        result.put("body", input.body.orElse(null));
        return result;
    }

    @Override
    public APIGatewayResponse fromJson(JSONObject input) {
        int statusCode = input.getInt("statusCode");
        Map<String, String> headers = toMap(input.optJSONObject("headers"));
        Optional<String> body = Optional.ofNullable(input.optString("body"));

        return new APIGatewayResponse(statusCode, headers, body);
    }
}
