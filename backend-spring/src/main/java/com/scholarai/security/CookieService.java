package com.scholarai.security;

import com.scholarai.config.AppProperties;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieService {
    private final AppProperties properties;

    public CookieService(AppProperties properties) {
        this.properties = properties;
    }

    public void addAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        addAccessCookie(response, accessToken);
        response.addHeader("Set-Cookie", ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true).secure(false).sameSite("Lax").path("/api/auth")
                .maxAge(Duration.ofDays(properties.jwt().refreshTokenDays())).build().toString());
    }

    public void addAccessCookie(HttpServletResponse response, String accessToken) {
        response.addHeader("Set-Cookie", ResponseCookie.from("access_token", accessToken)
                .httpOnly(true).secure(false).sameSite("Lax").path("/")
                .maxAge(Duration.ofMinutes(properties.jwt().accessTokenMinutes())).build().toString());
    }

    public void clearAuthCookies(HttpServletResponse response) {
        response.addHeader("Set-Cookie", ResponseCookie.from("access_token", "")
                .httpOnly(true).secure(false).sameSite("Lax").path("/").maxAge(0).build().toString());
        response.addHeader("Set-Cookie", ResponseCookie.from("refresh_token", "")
                .httpOnly(true).secure(false).sameSite("Lax").path("/api/auth").maxAge(0).build().toString());
    }
}
