package com.scholarai.auth.dto;

import com.scholarai.user.Role;
import com.scholarai.user.User;

import java.util.UUID;

public record AuthUserResponse(UUID id, String email, String name, String avatarUrl, Role role) {
    public static AuthUserResponse from(User user) {
        return new AuthUserResponse(user.getId(), user.getEmail(), user.getName(), user.getAvatarUrl(), user.getRole());
    }
}
