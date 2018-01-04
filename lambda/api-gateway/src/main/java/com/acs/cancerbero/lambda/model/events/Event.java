package com.acs.cancerbero.lambda.model.events;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@ToString
@EqualsAndHashCode
@AllArgsConstructor
public abstract class Event {
    public final UUID id;
    public final String type;
    public final String nodeId;
    public final LocalDateTime timestamp;
}
