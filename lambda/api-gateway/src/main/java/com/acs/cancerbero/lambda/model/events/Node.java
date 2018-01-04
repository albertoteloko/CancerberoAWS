package com.acs.cancerbero.lambda.model.events;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@ToString
@EqualsAndHashCode
@AllArgsConstructor
public class Node {
    public final String id;
    public final String name;
}