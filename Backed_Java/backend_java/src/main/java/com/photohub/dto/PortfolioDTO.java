package com.photohub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PortfolioDTO {
    private Long portfolioId;
    private Long photographerId;
    private String imageUrl;
    private String title;
    private String category;
}
