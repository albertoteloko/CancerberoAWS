package com.acs.cancerbero.lambda;

import com.acs.cancerbero.lambda.marshaller.ApiGatewayRequestMarshaller;
import com.acs.cancerbero.lambda.marshaller.ApiGatewayResponseMarshaller;
import com.acs.cancerbero.lambda.model.APIGatewayRequest;
import com.acs.cancerbero.lambda.model.APIGatewayResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.stream.Collectors;

abstract class ApiGatewayHandler implements RequestStreamHandler {

    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {

        RequestContext requestContext = new RequestContext(context);
        requestContext.log("Loading Java Lambda handler of ProxyWithStream");

        try {
            requestContext.start();
            APIGatewayRequest request = readRequest(inputStream);
            APIGatewayResponse response1 = handlerRequest(request, requestContext);
            sendResponse(outputStream, response1);
        } catch (JSONException | IllegalArgumentException e) {
            sendResponse(outputStream, APIGatewayResponse.error(400, e));
            requestContext.error(e);
        } finally {
            requestContext.end();
        }
    }

    protected abstract APIGatewayResponse handlerRequest(APIGatewayRequest request, RequestContext context);

    private APIGatewayRequest readRequest(InputStream inputStream) throws IOException {
        String input = read(inputStream);

        return new ApiGatewayRequestMarshaller().fromJson(new JSONObject(input));
    }

    private void sendResponse(OutputStream outputStream, APIGatewayResponse response) throws IOException {
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(new ApiGatewayResponseMarshaller().toJson(response).toString(2));
        writer.close();
    }

    private String read(InputStream input) throws IOException {
        try (BufferedReader buffer = new BufferedReader(new InputStreamReader(input))) {
            return buffer.lines().collect(Collectors.joining("\n"));
        }
    }
}