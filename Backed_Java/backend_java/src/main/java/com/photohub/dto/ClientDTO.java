package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long clientId;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String profilePicture;
    private String status;
}
