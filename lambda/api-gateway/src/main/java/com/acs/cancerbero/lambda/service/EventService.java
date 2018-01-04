package com.acs.cancerbero.lambda.service;

import com.acs.cancerbero.lambda.marshaller.EventMarshaller;
import com.acs.cancerbero.lambda.model.api.APIGatewayResponse;
import com.acs.cancerbero.lambda.model.events.Event;
import com.acs.cancerbero.lambda.model.events.Installation;
import com.acs.cancerbero.lambda.model.events.Node;
import com.acs.cancerbero.lambda.model.events.Ping;
import com.acs.cancerbero.lambda.repository.EventRepository;
import com.acs.cancerbero.lambda.repository.InstallationRepository;
import com.acs.cancerbero.lambda.repository.NodesRepository;
import lombok.AllArgsConstructor;

import java.util.Optional;

@AllArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final InstallationRepository installationRepository;
    private final NodesRepository nodesRepository;

    public APIGatewayResponse process(Event event) {
        if (event instanceof Ping) {
            return handlePing((Ping) event);
        }
        return null;
    }

    private APIGatewayResponse handlePing(Ping event) {
        Optional<Node> node = nodesRepository.read(event.nodeId);

        if (node.isPresent()) {
            eventRepository.save(event);
            return APIGatewayResponse.fromJson(200, new EventMarshaller().toJson(event));
        } else {
            return APIGatewayResponse.error(412, "Node with id '" + event.nodeId + "' not found");
        }
    }
}
