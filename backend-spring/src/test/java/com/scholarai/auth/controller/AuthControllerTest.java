package com.scholarai.auth.controller;

import com.scholarai.auth.AuthController;
import com.scholarai.auth.AuthService;
import com.scholarai.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest {
    @Test
    void meReturnsUnauthorizedWithoutAuthentication() throws Exception {
        var mvc = MockMvcBuilders.standaloneSetup(new AuthController(mock(AuthService.class)))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHENTICATED"));
    }
}
