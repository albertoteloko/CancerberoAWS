package com.acs.cancerbero.lambda.marshaller;

import com.acs.cancerbero.lambda.model.events.Node;
import org.json.JSONObject;


public class NodeMarshaller extends JSONMarshaller<Node> {
    @Override
    public JSONObject toJson(Node input) {
        JSONObject result = new JSONObject();
        result.put("id", input.id);
        result.put("name", input.name);
        return result;
    }


    @Override
    public Node fromJson(JSONObject input) {
        String id = input.getString("id");
        String name = input.getString("name");

        return new Node(
                id,
                name
        );
    }
}
