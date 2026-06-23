package com.scholarai.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.exception.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.Set;
import java.util.UUID;

@Component
public class CsrfCookieFilter extends OncePerRequestFilter {
    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD", "OPTIONS", "TRACE");
    private final ObjectMapper objectMapper;

    public CsrfCookieFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (SAFE_METHODS.contains(request.getMethod())) {
            if (!hasXsrfCookie(request)) {
                issueXsrfCookie(response);
            }
            filterChain.doFilter(request, response);
            return;
        }

        if (request.getRequestURI().startsWith("/api/") && !isValidToken(request)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getOutputStream(), new ErrorResponse(
                    Instant.now(),
                    HttpStatus.FORBIDDEN.value(),
                    "FORBIDDEN",
                    "Invalid CSRF token",
                    request.getRequestURI()
            ));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean hasXsrfCookie(HttpServletRequest request) {
        return request.getCookies() != null && Arrays.stream(request.getCookies()).map(Cookie::getName).anyMatch("XSRF-TOKEN"::equals);
    }

    private boolean isValidToken(HttpServletRequest request) {
        String cookieToken = request.getCookies() == null ? null : Arrays.stream(request.getCookies())
                .filter(cookie -> "XSRF-TOKEN".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
        String headerToken = request.getHeader("X-XSRF-TOKEN");
        return cookieToken != null && headerToken != null && cookieToken.equals(headerToken);
    }

    private void issueXsrfCookie(HttpServletResponse response) {
        response.addHeader("Set-Cookie", ResponseCookie.from("XSRF-TOKEN", UUID.randomUUID().toString())
                .httpOnly(false)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .build()
                .toString());
    }
}
