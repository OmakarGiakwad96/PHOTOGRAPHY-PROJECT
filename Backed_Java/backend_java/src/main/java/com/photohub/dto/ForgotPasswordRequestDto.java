package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequestDto {
    private String identifier; // Email or Indian mobile number
    private String channel = "EMAIL"; // "EMAIL" or "SMS"
}
