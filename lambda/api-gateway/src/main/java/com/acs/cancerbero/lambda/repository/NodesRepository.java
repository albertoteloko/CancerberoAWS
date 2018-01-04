package com.acs.cancerbero.lambda.repository;

import com.acs.cancerbero.lambda.marshaller.NodeMarshaller;
import com.acs.cancerbero.lambda.model.events.Node;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import lombok.AllArgsConstructor;
import org.json.JSONObject;

import java.util.Optional;

@AllArgsConstructor
public class NodesRepository {
    private final Table table;

    public Optional<Node> read(String nodeId) {
        Item item = table.getItem("id", nodeId);
        return Optional.ofNullable(item).map(this::toNode);
    }

    private Node toNode(Item item) {
        System.out.println(item.toJSONPretty());
        return new NodeMarshaller().fromJson(new JSONObject(item.toJSONPretty()));
    }
}
