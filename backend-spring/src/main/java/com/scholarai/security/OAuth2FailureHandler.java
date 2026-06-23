package com.scholarai.security;

import com.scholarai.config.AppProperties;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {
    private static final Logger log = LoggerFactory.getLogger(OAuth2FailureHandler.class);
    private final AppProperties properties;

    public OAuth2FailureHandler(AppProperties properties) {
        this.properties = properties;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.warn("OAuth2 login failed: type={}, message={}", exception.getClass().getName(), exception.getMessage(), exception);
        response.sendRedirect(properties.frontendUrl() + "/login?error=oauth_failed");
    }
}
