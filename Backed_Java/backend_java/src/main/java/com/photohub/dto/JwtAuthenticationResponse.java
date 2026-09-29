package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String role;
    private String name;
    
    public JwtAuthenticationResponse(String accessToken, Long userId, String role, String name) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.role = role;
        this.name = name;
    }
}
