package com.scholarai.auth;

import com.scholarai.auth.dto.AuthUserResponse;
import com.scholarai.auth.dto.LoginRequest;
import com.scholarai.auth.dto.RegisterRequest;
import com.scholarai.exception.BadRequestException;
import com.scholarai.exception.ConflictException;
import com.scholarai.security.CookieService;
import com.scholarai.security.JwtService;
import com.scholarai.token.RefreshTokenService;
import com.scholarai.user.AuthProvider;
import com.scholarai.user.Role;
import com.scholarai.user.User;
import com.scholarai.user.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokens;
    private final CookieService cookies;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService, RefreshTokenService refreshTokens, CookieService cookies) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokens = refreshTokens;
        this.cookies = cookies;
    }

    @Transactional
    public AuthUserResponse register(RegisterRequest request, HttpServletResponse response) {
        if (users.existsByEmail(request.email())) throw new ConflictException("Email is already registered");
        User user = new User();
        user.setEmail(request.email());
        user.setName(request.name());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setProvider(AuthProvider.LOCAL);
        user.setRole(Role.USER);
        user = users.save(user);
        issueCookies(user, response);
        return AuthUserResponse.from(user);
    }

    @Transactional
    public AuthUserResponse login(LoginRequest request, HttpServletResponse response) {
        User user = users.findByEmail(request.email()).orElseThrow(() -> new BadRequestException("Invalid email or password"));
        if (user.getPasswordHash() == null) throw new BadRequestException("Use Google login for this account");
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) throw new BadRequestException("Invalid email or password");
        issueCookies(user, response);
        return AuthUserResponse.from(user);
    }

    @Transactional
    public AuthUserResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String raw = refreshCookie(request);
        User user = refreshTokens.validate(raw);
        String accessToken = jwtService.createAccessToken(user);
        cookies.addAccessCookie(response, accessToken);
        return AuthUserResponse.from(user);
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        if (request.getCookies() != null) {
            Arrays.stream(request.getCookies()).filter(c -> "refresh_token".equals(c.getName())).findFirst().map(Cookie::getValue).ifPresent(refreshTokens::revoke);
        }
        cookies.clearAuthCookies(response);
        // Defense in depth: drop any HTTP session that may exist and clear the security context so
        // no server-side authentication can outlive the cleared JWT cookies.
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    public void issueCookies(User user, HttpServletResponse response) {
        cookies.addAuthCookies(response, jwtService.createAccessToken(user), refreshTokens.create(user));
    }

    private String refreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) throw new com.scholarai.exception.UnauthenticatedException("Refresh token is required");
        return Arrays.stream(request.getCookies()).filter(c -> "refresh_token".equals(c.getName())).findFirst()
                .map(Cookie::getValue).orElseThrow(() -> new com.scholarai.exception.UnauthenticatedException("Refresh token is required"));
    }
}
