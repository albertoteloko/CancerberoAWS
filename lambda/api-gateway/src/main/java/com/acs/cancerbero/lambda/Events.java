package com.acs.cancerbero.lambda;

import com.acs.cancerbero.lambda.marshaller.ApiGatewayRequestMarshaller;
import com.acs.cancerbero.lambda.marshaller.EventMarshaller;
import com.acs.cancerbero.lambda.model.APIGatewayRequest;
import com.acs.cancerbero.lambda.model.APIGatewayResponse;
import com.acs.cancerbero.lambda.model.HTTPMethod;
import com.acs.cancerbero.lambda.model.events.Event;
import org.json.JSONObject;

import java.util.Optional;

public class Events extends ApiGatewayHandler {
    @Override
    protected APIGatewayResponse handlerRequest(APIGatewayRequest request, RequestContext context) {
        if (request.path.equals("/events")) {
            if (request.method == HTTPMethod.POST) {
                return handleIncomingEvent(request, context);
            } else {
                return APIGatewayResponse.error(405, "Method Not Allowed");
            }
        } else {
            return APIGatewayResponse.error(404, "Resource not found");
        }
    }

    private APIGatewayResponse handleIncomingEvent(APIGatewayRequest request, RequestContext context) {
        EventMarshaller eventMarshaller = new EventMarshaller();
        Optional<Event> event = request.fromJson(eventMarshaller::fromJson);
        if (event.isPresent()) {
//            JSONObject json = new ApiGatewayRequestMarshaller().toJson(request);
            return APIGatewayResponse.fromJson(200, eventMarshaller.toJson(event.get()));
        } else {
            return APIGatewayResponse.error(400, "Missing body");
        }
    }
}