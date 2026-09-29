package com.photohub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PackageDTO {
    private Long packageId;
    private Long photographerId;
    private String name;
    private String description;
    private Double price;
    private Integer durationHours;
    private String features;
}
