package com.acs.cancerbero.lambda.repository;

import com.acs.cancerbero.lambda.marshaller.EventMarshaller;
import com.acs.cancerbero.lambda.model.events.Event;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import lombok.AllArgsConstructor;
import org.json.JSONObject;

import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
public class EventRepository {
    private final Table table;

    public Optional<Event> read(UUID id) {
        Item item = table.getItem("id", id);
        return Optional.ofNullable(item).map(this::toEvent);
    }

    public void save(Event event) {
        Item item = toItem(event);

        System.out.println(".-.-.-." + item.toJSONPretty());
        PutItemOutcome outcome = table.putItem(item);
        System.out.println("---" + outcome.getPutItemResult().toString());
    }

    private Event toEvent(Item item) {
        return new EventMarshaller().fromJson(new JSONObject(item.toJSONPretty()));
    }

    private Item toItem(Event event) {
        return new Item()
                .withPrimaryKey("id", event.id.toString())
                .withString("nodeId", event.nodeId)
                .withString("type", event.type)
                .withString("type", event.type)
                .withString("timestamp", event.timestamp.format(DateTimeFormatter.ISO_DATE_TIME));
    }
}
