package com.photohub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewDTO {
    private Long reviewId;
    private Long userId;
    private Long photographerId;
    private Integer rating;
    private String comment;
    private String userName; // To display who wrote the review
}
