package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackageImageDTO {
    private Long id;
    private String imageUrl;
    private String description;
    private Boolean isDeleted;
}
