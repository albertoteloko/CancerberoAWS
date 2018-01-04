package com.acs.cancerbero.lambda.repository;

import com.acs.cancerbero.lambda.model.events.Installation;

import java.util.Optional;

public class InstallationRepository {
    public Optional<Installation> findByNodeId(String nodeId) {
        return Optional.empty();
    }
}
