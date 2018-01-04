package com.acs.cancerbero.lambda.marshaller;

import com.acs.cancerbero.lambda.model.events.Event;
import com.acs.cancerbero.lambda.model.events.Ping;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public class EventMarshaller extends Marshaller<Event> {


    @Override
    public JSONObject toJson(Event input) {
        JSONObject result = new JSONObject();
        result.put("id", input.id);
        result.put("type", input.type);
        result.put("nodeId", input.nodeId);
        putLocalDateTime(result, "timestamp", input.timestamp);

        if (input instanceof Ping) {

        }
        return result;
    }


    @Override
    public Event fromJson(JSONObject input) {
        UUID id = Optional.ofNullable(input.optString("id")).filter(s -> !s.isEmpty()).map(UUID::fromString).orElse(UUID.randomUUID());
        String type = input.getString("type");
        String nodeId = input.getString("nodeId");
        LocalDateTime timestamp = getLocalDateTime(input, "timestamp");

        if (type.equals("ping")) {
            return new Ping(id, nodeId, timestamp);
        } else {
            throw new JSONException("Event type '" + type + "' not supported");
        }
    }

    //    {
//        "body": "{\"test\":\"body\"}",
//            "resource": "/{proxy+}",
//            "requestContext": {
//        "resourceId": "123456",
//                "apiId": "1234567890",
//                "resourcePath": "/{proxy+}",
//                "httpMethod": "POST",
//                "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
//                "accountId": "123456789012",
//                "identity": {
//            "apiKey": null,
//                    "userArn": null,
//                    "cognitoAuthenticationType": null,
//                    "caller": null,
//                    "userAgent": "Custom User Agent String",
//                    "user": null,
//                    "cognitoIdentityPoolId": null,
//                    "cognitoIdentityId": null,
//                    "cognitoAuthenticationProvider": null,
//                    "sourceIp": "127.0.0.1",
//                    "accountId": null
//        },
//        "stage": "prod"
//    },
//        "queryStringParameters": {
//        "foo": "bar"
//    },
//        "headers": {
//        "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
//                "Accept-Language": "en-US,en;q=0.8",
//                "CloudFront-Is-Desktop-Viewer": "true",
//                "CloudFront-Is-SmartTV-Viewer": "false",
//                "CloudFront-Is-Mobile-Viewer": "false",
//                "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
//                "CloudFront-Viewer-Country": "US",
//                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//                "Upgrade-Insecure-Requests": "1",
//                "X-Forwarded-Port": "443",
//                "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
//                "X-Forwarded-Proto": "https",
//                "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
//                "CloudFront-Is-Tablet-Viewer": "false",
//                "Cache-Control": "max-age=0",
//                "User-Agent": "Custom User Agent String",
//                "CloudFront-Forwarded-Proto": "https",
//                "Accept-Encoding": "gzip, deflate, sdch"
//    },
//        "pathParameters": {
//        "proxy": "path/to/resource"
//    },
//        "httpMethod": "POST",
//            "stageVariables": {
//        "baz": "qux"
//    },
//        "path": "/path/to/resource"
//    }
}
