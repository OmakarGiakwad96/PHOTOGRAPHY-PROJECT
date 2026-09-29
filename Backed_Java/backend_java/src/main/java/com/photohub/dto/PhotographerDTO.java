package com.photohub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PhotographerDTO {
    private Long photographerId;
    private Long userId;
    private String name;
    private Integer experience;
    private String bio;
    private String location;
    private Double rating;
    private Double pricePerHour;
    private boolean isVerified;
    private String coverImage;
    private String specialties;
}
