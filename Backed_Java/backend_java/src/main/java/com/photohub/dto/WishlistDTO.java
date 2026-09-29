package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistDTO {
    private Long id;
    private Long userId;
    private Long packageId;
    private Boolean isDeleted;
}
