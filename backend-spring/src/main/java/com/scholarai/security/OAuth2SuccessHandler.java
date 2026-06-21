package com.scholarai.security;

import com.scholarai.auth.AuthService;
import com.scholarai.config.AppProperties;
import com.scholarai.user.AuthProvider;
import com.scholarai.user.Role;
import com.scholarai.user.User;
import com.scholarai.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private static final Logger log = LoggerFactory.getLogger(OAuth2SuccessHandler.class);
    private final UserRepository users;
    private final AuthService authService;
    private final AppProperties properties;

    public OAuth2SuccessHandler(UserRepository users, AuthService authService, AppProperties properties) {
        this.users = users;
        this.authService = authService;
        this.properties = properties;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");
        String sub = oauthUser.getAttribute("sub");
        log.info("OAuth2 success received from Google for email={}", email);
        User user = users.findByEmail(email).orElseGet(() -> {
            User created = new User();
            created.setEmail(email);
            created.setName(name);
            created.setAvatarUrl(picture);
            created.setProvider(AuthProvider.GOOGLE);
            created.setProviderId(sub);
            created.setRole(Role.USER);
            return users.save(created);
        });
        log.info("OAuth2 resolved local user id={}, provider={}, hasPassword={}", user.getId(), user.getProvider(), user.getPasswordHash() != null);
        if (user.getProviderId() == null && user.getPasswordHash() == null) {
            user.setProvider(AuthProvider.GOOGLE);
            user.setProviderId(sub);
        }
        if (user.getAvatarUrl() == null) user.setAvatarUrl(picture);
        authService.issueCookies(user, response);
        log.info("OAuth2 auth cookies issued for user id={}", user.getId());
        response.sendRedirect(properties.frontendUrl() + "/auth/oauth/success");
    }
}
