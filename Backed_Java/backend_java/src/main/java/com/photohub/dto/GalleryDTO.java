package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryDTO {
    private Long id;
    private String title;
    private String description;
    private Boolean isDeleted;
}
