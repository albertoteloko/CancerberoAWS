package com.acs.cancerbero.lambda.repository;

import com.acs.cancerbero.lambda.model.events.Installation;
import com.acs.cancerbero.lambda.model.events.Node;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import lombok.AllArgsConstructor;

import java.util.Iterator;
import java.util.Optional;

@AllArgsConstructor
public class NodesRepository {
    private final Table table;

    public Optional<Node> read(String nodeId) {
        QuerySpec spec = new QuerySpec()
                .withKeyConditionExpression("Id = :v_id")
                .withValueMap(new ValueMap()
                        .withString(":v_id", nodeId));

        ItemCollection<QueryOutcome> items = table.query(spec);

        Iterator<Item> iterator = items.iterator();
        Item item = null;
        while (iterator.hasNext()) {
            item = iterator.next();
            System.out.println(item.toJSONPretty());
        }

        return Optional.empty();
    }

}
