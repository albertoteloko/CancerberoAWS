package com.acs.cancerbero.lambda;

import com.acs.cancerbero.lambda.repository.EventRepository;
import com.acs.cancerbero.lambda.repository.InstallationRepository;
import com.acs.cancerbero.lambda.service.EventService;
import com.amazonaws.services.lambda.runtime.ClientContext;
import com.amazonaws.services.lambda.runtime.CognitoIdentity;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class RequestContext implements Context {
    private final Context delegate;

    @Override
    public String getAwsRequestId() {
        return delegate.getAwsRequestId();
    }

    @Override
    public String getLogGroupName() {
        return delegate.getLogGroupName();
    }

    @Override
    public String getLogStreamName() {
        return delegate.getLogStreamName();
    }

    @Override
    public String getFunctionName() {
        return delegate.getFunctionName();
    }

    @Override
    public String getFunctionVersion() {
        return delegate.getFunctionVersion();
    }

    @Override
    public String getInvokedFunctionArn() {
        return delegate.getInvokedFunctionArn();
    }

    @Override
    public CognitoIdentity getIdentity() {
        return delegate.getIdentity();
    }

    @Override
    public ClientContext getClientContext() {
        return delegate.getClientContext();
    }

    @Override
    public int getRemainingTimeInMillis() {
        return delegate.getRemainingTimeInMillis();
    }

    @Override
    public int getMemoryLimitInMB() {
        return delegate.getMemoryLimitInMB();
    }

    @Override
    public LambdaLogger getLogger() {
        return delegate.getLogger();
    }

    public void log(String string) {
        getLogger().log(string);
    }

    public void start() {

    }

    public void end() {

    }

    public void error(Throwable e) {
        e.printStackTrace();
    }

    public EventService getEventService() {
        return new EventService(
                getEventRepository(),
                getInstallationRepository()
        );
    }

    private EventRepository getEventRepository() {
        return new EventRepository();
    }

    private InstallationRepository getInstallationRepository() {
        return new InstallationRepository();
    }
}
