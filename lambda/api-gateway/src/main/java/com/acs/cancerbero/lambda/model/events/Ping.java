package com.acs.cancerbero.lambda.model.events;

import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class Ping extends Event {

    public static final String TYPE = "ping";

    public Ping(UUID id, String nodeId, LocalDateTime timestamp) {
        super(id, TYPE, nodeId, timestamp);
    }
}
