package com.scholarai.token;

import com.scholarai.config.AppProperties;
import com.scholarai.exception.UnauthenticatedException;
import com.scholarai.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository tokens;
    private final AppProperties properties;

    public RefreshTokenService(RefreshTokenRepository tokens, AppProperties properties) {
        this.tokens = tokens;
        this.properties = properties;
    }

    @Transactional
    public String create(User user) {
        String raw = UUID.randomUUID() + "." + UUID.randomUUID();
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(hash(raw));
        token.setExpiresAt(Instant.now().plusSeconds(properties.jwt().refreshTokenDays() * 86400));
        tokens.save(token);
        return raw;
    }

    @Transactional(readOnly = true)
    public User validate(String raw) {
        RefreshToken token = tokens.findByTokenHash(hash(raw)).orElseThrow(() -> new UnauthenticatedException("Invalid refresh token"));
        if (token.isRevoked() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new UnauthenticatedException("Invalid refresh token");
        }
        return token.getUser();
    }

    @Transactional
    public void revoke(String raw) {
        tokens.findByTokenHash(hash(raw)).ifPresent(token -> token.setRevoked(true));
    }

    public String hash(String raw) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(ex);
        }
    }
}
