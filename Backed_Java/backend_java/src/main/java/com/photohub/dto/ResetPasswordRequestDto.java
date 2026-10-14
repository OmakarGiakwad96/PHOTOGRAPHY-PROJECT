package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequestDto {
    private String identifier;
    private String token; // For link-based reset
    private String otp;   // For OTP-based reset
    private String newPassword;
    private String confirmPassword;
}
