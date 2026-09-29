package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response returned after a successful registration.
 * Includes the JWT token so the client can be logged in immediately.
 */
@Data
@AllArgsConstructor
public class RegisterResponse {
    private String token;
    private Long userId;
    private String role;
    private String email;
    private String message;
}
