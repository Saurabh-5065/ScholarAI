package com.scholarai.auth;

import com.scholarai.auth.dto.LoginRequest;
import com.scholarai.auth.dto.RegisterRequest;
import com.scholarai.security.CookieService;
import com.scholarai.security.JwtService;
import com.scholarai.token.RefreshTokenService;
import com.scholarai.user.AuthProvider;
import com.scholarai.user.Role;
import com.scholarai.user.User;
import com.scholarai.user.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final JwtService jwt = mock(JwtService.class);
    private final RefreshTokenService refreshTokens = mock(RefreshTokenService.class);
    private final CookieService cookies = mock(CookieService.class);
    private final AuthService service = new AuthService(users, new BCryptPasswordEncoder(), jwt, refreshTokens, cookies);

    @Test
    void registerHashesPasswordAndIssuesCookies() {
        when(users.existsByEmail("arun@example.com")).thenReturn(false);
        when(users.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(UUID.randomUUID());
            return user;
        });
        when(jwt.createAccessToken(any())).thenReturn("access");
        when(refreshTokens.create(any())).thenReturn("refresh");
        HttpServletResponse response = mock(HttpServletResponse.class);

        var result = service.register(new RegisterRequest("Arun Kumar Singh", "arun@example.com", "StrongPassword@123"), response);

        assertThat(result.email()).isEqualTo("arun@example.com");
        verify(users).save(argThat(user -> user.getProvider() == AuthProvider.LOCAL
                && user.getRole() == Role.USER
                && user.getPasswordHash() != null
                && !user.getPasswordHash().equals("StrongPassword@123")));
        verify(cookies).addAuthCookies(response, "access", "refresh");
    }

    @Test
    void loginAcceptsValidPasswordAndIssuesCookies() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("arun@example.com");
        user.setName("Arun Kumar Singh");
        user.setRole(Role.USER);
        user.setPasswordHash(new BCryptPasswordEncoder().encode("StrongPassword@123"));
        when(users.findByEmail("arun@example.com")).thenReturn(Optional.of(user));
        when(jwt.createAccessToken(user)).thenReturn("access");
        when(refreshTokens.create(user)).thenReturn("refresh");
        HttpServletResponse response = mock(HttpServletResponse.class);

        var result = service.login(new LoginRequest("arun@example.com", "StrongPassword@123"), response);

        assertThat(result.id()).isEqualTo(user.getId());
        verify(cookies).addAuthCookies(response, "access", "refresh");
    }
}
