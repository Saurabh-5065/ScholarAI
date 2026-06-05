package com.scholarai.auth;

import com.scholarai.auth.dto.*;
import com.scholarai.exception.UnauthenticatedException;
import com.scholarai.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public AuthUserResponse register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        return service.register(request, response);
    }

    @PostMapping("/login")
    public AuthUserResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        return service.login(request, response);
    }

    @PostMapping("/refresh")
    public AuthUserResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        return service.refresh(request, response);
    }

    @PostMapping("/logout")
    public LogoutResponse logout(HttpServletRequest request, HttpServletResponse response) {
        service.logout(request, response);
        return new LogoutResponse("Logged out successfully");
    }

    @GetMapping("/me")
    public AuthUserResponse me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthenticatedException("Authentication required");
        }
        return AuthUserResponse.from(principal.getUser());
    }
}
