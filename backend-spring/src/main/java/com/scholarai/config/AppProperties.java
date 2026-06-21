package com.scholarai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String frontendUrl,
        String aiServiceUrl,
        String aiServiceToken,
        Jwt jwt,
        String uploadDir
) {
    public record Jwt(String secret, long accessTokenMinutes, long refreshTokenDays) {
    }
}
