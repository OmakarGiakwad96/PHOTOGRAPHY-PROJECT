package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpRequestDto {
    private String identifier; // Email or Indian mobile number
    private String channel = "SMS"; // "SMS" or "EMAIL"
    private String purpose = "REGISTRATION"; // "REGISTRATION", "FORGOT_PASSWORD", "LOGIN", "PHONE_VERIFICATION"
}
